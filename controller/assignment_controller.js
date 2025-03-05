const express = require("express");
const { assignments, events, organisers } = require("../data/data");

//get all the event assignments made to organisers
exports.getAllAssignments =  (req, res) => {
  return res.status(200).json(assignments);
};

//iske jagah by event name bhi kr skta hun
exports.getAssignmentsByEventId =  (req, res) => {
    const eId = parseInt(req.params.eId);
    const byEventId = assignments.filter(a => a.eId === eId);
    return res.status(200).json(byEventId);
};
  

//iski jagah by organiser name bhi kr skta hun
exports.getAssignmentsByOrganiserId =  (req, res) => {
    const organiserId = parseInt(req.params.organiserId);
    const byOrganiserId = assignments.filter(a => a.organiserId === organiserId);
    return res.status(200).json(byOrganiserId);
};
  
//making assignment/tasks for event postings with eventsId aur organiserId
exports.makeAssignment =  (req, res) => {
  const { eId, oId } = req.body;
  const event = events.find(e => e.id === eId);
  if (!event) {
    return res.status(400).json({message:"Event not found"});
  }
  const organiser = organisers.find(o => o.id === oId);
  if (!organiser) {
    return res.status(400).json({message:"Organiser not found"});
  }
  
  
  const duplicate = assignments.find(a => a.eId === eId && a.oId === oId);
  if (duplicate) {
    return res.status(400).json({message:"Assignment already exists"});
  }
  const newAssignment = { eId, oId, eventName: event.name };
  assignments.push(newAssignment);
  console.log(newAssignment);
  return res.status(200).json(newAssignment);
};

exports.deleteAssignment =  (req, res) => {
  const { eId, oId } = req.body;
  console.log(eId, oId);
  const index = assignments.findIndex(a => a.eId === eId && a.oId === oId);
  if (index === -1) {
    return res.status(400).json({ message: "Assignment not found" });
  }
  assignments.splice(index, 1);
  return res.status(200).json({ message: "Assignment successfully deleted" });
};


