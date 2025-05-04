const express = require("express");
const {organisers } = require("../data/data");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

// Get all organisers
exports.getAll = async (req, res) => {
    try {
        const organisers = await User.find({ role: "organiser" }); 
        return res.status(200).json(organisers);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching organisers", error });
    }
};

// Get organiser by ID
exports.getOrganiserById = async (req, res) => {
    const id = req.params.id;
    try {
        const organiser = await User.findById(id);
        if (!organiser || organiser.role !== "organiser") {
            return res.status(404).json({ message: "Organiser not found" });
        }
        return res.status(200).json(organiser);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching organiser", error });
    }
};

// Create a new organiser(ab btw zarrot nhi hai iski kyunki mein ab signup kr rha hun)
exports.postOrganiser = async (req, res) => {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
        return res.status(400).json({ message: "All organiser fields are required" });
    }

    try {
        const newOrganiser = new User({ name, email, role, password: "defaultPassword" }); 
        await newOrganiser.save();
        return res.status(201).json(newOrganiser);
    } catch (error) {
        return res.status(500).json({ message: "Error creating organiser", error });
    }
};

// Update organiser by ID
exports.updateOrganiser = async (req, res) => {
    const id = req.params.id;
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
        return res.status(400).json({ message: "All organiser fields are required" });
    }

    try {
        const updatedOrganiser = await User.findByIdAndUpdate(
            id,
            { name, email, role },
            { new: true, runValidators: true }
        );
        if (!updatedOrganiser) {
            return res.status(404).json({ message: "Organiser not found" });
        }
        return res.status(200).json(updatedOrganiser);
    } catch (error) {
        return res.status(500).json({ message: "Error updating organiser", error });
    }
};

// Delete organiser by ID
exports.deleteOrganiser = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedOrganiser = await User.findByIdAndDelete(id);
        if (!deletedOrganiser) {
            return res.status(404).json({ message: "Organiser not found" });
        }
        return res.status(200).json({ message: "Organiser successfully deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Error deleting organiser", error });
    }
};



exports.signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();
        console.log(newUser.name);
        return res.status(201).json({
            message: "Signup successful",
            
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
        });
    } catch (error) {
        return res.status(500).json({ message: "Error during signup", error });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
            expiresIn: '7d',
        });

        return res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        return res.status(500).json({ message: "Error during login", error });
    }
};
