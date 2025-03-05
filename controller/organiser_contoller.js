const express = require("express");
const {organisers } = require("../data/data");




const generateId = () => Math.floor(Math.random() * 1000000);

//for the organisers now - get all(wihtout id)
exports.getAll =  (req, res) => {
    return res.status(200).json(organisers);
};

//retrieving organiser by id
exports.getOrganiserById =  (req, res) => {
    const id = parseInt(req.params.id);
    const organiser = organisers.find(o => o.id === id);
    if (!organiser) {
        return res.status(400).json({ message: "Organiser not found" });
    }
    return res.status(200).json(organiser);
};

//posting an organiser not required now as added in signup
// exports.postOrganiser = (req, res) => {
//     const { name, email, role } = req.query;
//     if (!name || !email || !role) {
//         return res.status(400).json({ message: "All organiser fields are required" });
//     }
//     const newOrganiser = {
//         name,
//         email,
//         role
//     }
//     console.log("organiser ID:", newOrganiser.id);
//     organisers.push(newOrganiser);
//     return res.status(200).json(organisers);
// };

//updating an organiser by id
exports.updateOrganiser =  (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email, role } = req.query;
    if (!name || !email || !role) {
        return res.status(400).json({ message: "All organiser fields are required" });
    }
    const index = organisers.findIndex(o => o.id === id);
    if (index === -1) {
        return res.status(400).json("Organiser not found");
    }
    //is index pe change hua hai arr organisers wali mein
    organisers[index] = { id, name, email, role };
    //for the updated event
    return res.status(200).json(organisers[index]);
};

//deleted organisers
exports.deleteOrganiser = (req, res) => {
    const id = parseInt(req.params.id);
    const index = organisers.findIndex(o => o.id === id);
    if (index === -1) {
      return res.status(400).json({ message: "Organiser not found!!!" });
    }
    organisers.splice(index, 1);
    return res.status(200).json({ message: "Organiser successfully deleted!!!" });
};



exports.signup =  async (req, res) => {
    const { name, email, password,role } = req.query;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existing = organisers.find(o => o.email === email);
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }
    try {
      const newOrganiser = {
        id: generateId(),
        name,
        email,
        password: password,
        role: role
      };
      organisers.push(newOrganiser);
      console.log(newOrganiser);
      return res.status(201).json({
        message: "Signup successful",
        organiser: { id:newOrganiser.id, name: newOrganiser.name, email: newOrganiser.email, role: newOrganiser.role }
      });
    } catch (error) {
      return res.status(500).json({ message: "Error during signup" });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.query;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const organiser = organisers.find(o => o.email === email);
    if (!organiser) {
      return res.status(400).json({ message: "Invalid Organiser Details" });
    }
    try {
      if (!password===organiser.password) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }
      return res.status(200).json({ message: "Login successful",
        organiser: { name: organiser.name, email: organiser.email, role: organiser.role }
      });
    } catch (error) {
      return res.status(500).json({ message:   "Error during login" });
    }
};

