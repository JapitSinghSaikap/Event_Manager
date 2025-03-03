const express = require("express");
const router = express.Router();
const{events} = require("../data/data");


const generateId = () => Math.floor(Math.random() * 1000000);


exports.getAllEvents =  (req, res) => {
    return res.status(200).json(events);
};


exports.getEventById =  (req, res) => {
    const id = parseInt(req.params.id);
    const event = events.find(e => e.id === id);
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }
    return res.status(200).json(event);
};


exports.postEvent =  (req, res) => {
    const { name, date, location, description } = req.query;
    if (!name || !date || !location || !description) {
        return res.status(400).json({ message: "All event fields are required" });
    }
    const newEvent = {
        id: generateId(),
        name,
        date,
        location,
        description,
    }
    console.log("event ID:", newEvent.id);
    events.push(newEvent);
    return res.status(200).json(events);
};


exports.updateEvent = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, date, location, description } = req.body;
    if (!name || !date || !location || !description) {
        return res.status(400).json({ message: "All event fields are required" });
    }
    const index = events.findIndex(e => e.id === id);
    if (index === -1) {
        return res.status(400).json({ message: "Event not found" });
    }
    events[index] = { id, name, date, location, description };
    return res.status(200).json(events[index]);
};


exports.deleteEvent = (req, res) => {
    const id = parseInt(req.params.id);
    const index = events.findIndex(e => e.id === id);
    if (index === -1) {
        return res.status(400).json({ message: "Event not found!!!" });
    }
    events.splice(index, 1);
    return res.status(200).json({ message: "Event succesfully deleted!!!" });
};


