const express = require("express");
const Event = require("../model/eventModel");
const User = require('../model/userModel')
const { sendRegistrationEmail, sendOrganizerNotification } = require('../utils/emailSender');
const Assignment = require('../model/assignModel');

exports.registerForEvent = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id)
        .populate('organiser', 'email name')
        .populate('attendees.user', 'email name');
  
      const user = await User.findById(req.user.id);
      
      // Validate existence
      if (!event || !user) return res.status(404).json({ message: "Not found" });
  
      // Check existing registration
      const isRegistered = event.attendees.some(a => 
        a.user._id.equals(user._id) || 
        a.user.equals(user._id)
      );
      
      if (isRegistered) return res.status(400).json({ message: "Already registered" });
  
      // Add to attendees
      event.attendees.push({ user: user._id });
      await event.save();
  
      // Send emails
      await sendRegistrationEmail(
        user.email,
        {
          title: event.title,
          startDate: event.startDate,
          location: event.location
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
        event: await Event.findById(event._id).populate('attendees.user')
      });
  
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  };
  

exports.checkRegistrationStatus = async (req, res) => {
    try {
      const event = await Event.findById(req.params.id)
        .populate('attendees.user', '_id');
      
      if (!event) return res.status(404).json({ message: "Event not found" });
  
      const isRegistered = event.attendees.some(attendee => 
        attendee.user?._id.toString() === req.user.id
      );
      
      res.status(200).json({ isRegistered });
    } catch (error) {
      console.error("Registration check error:", error);
      res.status(500).json({ message: "Error checking registration status" });
    }
  };
  
// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate("organiser", "name email"); // Fixed field name
        return res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error); // Added logging
        return res.status(500).json({ message: "Error fetching events", error });
    }
};

// Get event by ID
exports.getEventById = async (req, res) => {
    const id = req.params.id;
    try {
        const event = await Event.findById(id).populate("organiser", "name email"); // Fixed field name
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json(event);
    } catch (error) {
        console.error("Error fetching event:", error); // Added logging
        return res.status(500).json({ message: "Error fetching event", error });
    }
};

// Create a new event
exports.postEvent = async (req, res) => {
    try {
      console.log("Received body:", req.body);
      const { title, description, type, format, technologies, startDate, endDate, location, imageUrl } = req.body;
  
      const newEvent = new Event({
        title,
        description,
        type,
        format,
        technologies: technologies || [],
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        organiser: req.user.id,
        imageUrl
      });
  
      console.log("Saving event:", newEvent);
  
      await newEvent.save();
      res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
      console.error("Event creation error:", error);
      res.status(500).json({ message: error.message });
    }
};
  

// Update an event
exports.updateEvent = async (req, res) => {
    const id = req.params.id;
    const { title, description, type, format, technologies, startDate, endDate, location,imageUrl  } = req.body;

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
        return res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (error) {
        console.error("Error updating event:", error);
        return res.status(500).json({ message: "Error updating event", error });
    }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json({ message: "Event successfully deleted" });
    } catch (error) {
        console.error("Error deleting event:", error);
        return res.status(500).json({ message: "Error deleting event", error });
    }
};
