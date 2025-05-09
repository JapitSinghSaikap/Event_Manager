const express = require("express");
const Event = require("../model/eventModel");
const User = require("../model/userModel");
const Assignment = require("../model/assignModel");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");
const {
  sendRegistrationEmail,
  sendOrganizerNotification
} = require("../utils/emailSender");

// Register for Event
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organiser", "email name")
      .populate("attendees.user", "email name");

    const user = await User.findById(req.user.id);

    if (!event || !user) {
      return res.status(404).json({ message: "Event or user not found" });
    }

    const isRegistered = event.attendees.some(
      (attendee) =>
        attendee.user?._id?.equals(user._id) || attendee.user?.equals(user._id)
    );

    if (isRegistered) {
      return res.status(400).json({ message: "Already registered" });
    }

    const ticketId = uuidv4();
    const qrCodeDataURL = await QRCode.toDataURL(ticketId);

    event.attendees.push({
      user: user._id,
      ticketId,
      registeredAt: new Date()
    });

    await event.save();

    await sendRegistrationEmail(
      user.email,
      {
        title: event.title,
        startDate: event.startDate,
        location: event.location,
        ticketId,
        qrCode: qrCodeDataURL
      },
      event.organiser.email
    );

    await sendOrganizerNotification(
      event.organiser.email,
      {
        title: event.title,
        attendeesCount: event.attendees.length
      },
      {
        name: user.name,
        email: user.email
      }
    );

    res.status(200).json({
      message: "Registration successful",
      event: await Event.findById(event._id).populate("attendees.user")
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// Check Registration Status
exports.checkRegistrationStatus = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "attendees.user",
      "_id"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isRegistered = event.attendees.some(
      (attendee) => attendee.user?._id?.toString() === req.user.id
    );

    res.status(200).json({ isRegistered });
  } catch (error) {
    console.error("Registration check error:", error);
    res.status(500).json({ message: "Error checking registration status" });
  }
};

// Verify Ticket
exports.verifyTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;
    const eventId = req.params.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organiser.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only organizers can verify tickets" });
    }

    const attendeeIndex = event.attendees.findIndex((a) => a.ticketId === ticketId);

    if (attendeeIndex === -1) {
      return res.status(404).json({ message: "Invalid ticket" });
    }

    if (event.attendees[attendeeIndex].checkedIn) {
      return res.status(400).json({ message: "Ticket already used for check-in" });
    }

    event.attendees[attendeeIndex].checkedIn = true;
    await event.save();

    return res.status(200).json({
      message: "Check-in successful",
      attendee: await User.findById(
        event.attendees[attendeeIndex].user,
        "name email"
      )
    });
  } catch (error) {
    console.error("Ticket verification error:", error);
    res.status(500).json({ message: "Error verifying ticket" });
  }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organiser", "name email");
    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ message: "Error fetching events", error });
  }
};

// Get Event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organiser", "name email");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({ message: "Error fetching event", error });
  }
};


// Create Event
exports.postEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      format,
      technologies,
      startDate,
      endDate,
      location = "",
      imageUrl = ""
    } = req.body;

    // Basic required fields check
    if (!title || !description || !type || !format || !startDate || !endDate) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }
    // Parse and validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid start or end date" });
    }
    if (end < start) {
      return res.status(400).json({ message: "End date must be after start date" });
    }
    
    const trimedTitle = title.trim();
    const trimedDescription = description.trim();
    // Ensure technologies is an array
    const technologiesArray = Array.isArray(technologies)
      ? technologies
      : (typeof technologies === "string" && technologies.length > 0)
        ? technologies.split(",").map(t => t.trim())
        : [];

    const newEvent = new Event({
      title : trimedTitle,
      description : trimedDescription,
      type,
      format,
      technologies: technologiesArray,
      startDate : start,
      endDate : end,
      location,
      organiser: req.user.id,
      imageUrl
    });

    await newEvent.save();

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.error("Event creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Update Event
exports.updateEvent = async (req, res) => {
  const id = req.params.id;
  const {
    title,
    description,
    type,
    format,
    technologies,
    startDate,
    endDate,
    location,
    imageUrl
  } = req.body;

  if (!title || !description || !type || !format || !startDate || !endDate) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        description,
        type,
        format,
        technologies,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        imageUrl
      },
      { new: true, runValidators: true }
    ).populate("organiser", "name email");

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res
      .status(200)
      .json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ message: "Error updating event", error });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json({ message: "Event successfully deleted" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return res.status(500).json({ message: "Error deleting event", error });
  }
};
