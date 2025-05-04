const Assignment = require("../model/assignModel"); 
const Event = require("../model/eventModel");
const User = require("../model/userModel");


//get all the event assignments made to organisers
exports.getAllAssignments = async (req, res) => {
  try {
      const assignments = await Assignment.find()
          .populate("eventId", "name date location")
          .populate("organiserId", "name email role");
      return res.status(200).json(assignments);
  } catch (error) {
      return res.status(500).json({ message: "Error fetching assignments", error });
  }
};

//iske jagah by event name bhi kr skta hun
exports.getAssignmentsByEventId = async (req, res) => {
  const eventId = req.params.eId;
  try {
      const assignments = await Assignment.find({ eventId })
          .populate("eventId", "name date location")
          .populate("organiserId", "name email role");
      return res.status(200).json(assignments);
  } catch (error) {
      return res.status(500).json({ message: "Error fetching assignments by event ID", error });
  }
};

//iski jagah by organiser name bhi kr skta hun
exports.getAssignmentsByOrganiserId = async (req, res) => {
  const organiserId = req.params.organiserId;
  try {
      const assignments = await Assignment.find({ organiserId })
          .populate("eventId", "name date location")
          .populate("organiserId", "name email role");
      return res.status(200).json(assignments);
  } catch (error) {
      return res.status(500).json({ message: "Error fetching assignments by organiser ID", error });
  }
};
  

exports.makeAssignment = async (req, res) => {
  const { eventId, organiserId } = req.body;

  try {
      const event = await Event.findById(eventId);
      if (!event) {
          return res.status(400).json({ message: "Event not found" });
      }
      const organiser = await User.findById(organiserId);
      if (!organiser) {
          return res.status(400).json({ message: "Organiser not found" });
      }
      const duplicate = await Assignment.findOne({ eventId, organiserId });
      if (duplicate) {
          return res.status(400).json({ message: "Assignment already exists" });
      }
      const newAssignment = new Assignment({ eventId, organiserId });
      await newAssignment.save();

      return res.status(201).json({ message: "Assignment created successfully", assignment: newAssignment });
  } catch (error) {
      return res.status(500).json({ message: "Error creating assignment", error });
  }
};

exports.deleteAssignment = async (req, res) => {
  const { eventId, organiserId } = req.body;

  try {
      const assignment = await Assignment.findOneAndDelete({ eventId, organiserId });
      if (!assignment) {
          return res.status(404).json({ message: "Assignment not found" });
      }
      return res.status(200).json({ message: "Assignment successfully deleted" });
  } catch (error) {
      return res.status(500).json({ message: "Error deleting assignment", error });
  }
};

