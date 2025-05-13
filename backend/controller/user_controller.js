const User = require("../model/userModel");
const mongoose = require("mongoose");
exports.addEventToUser = async (req, res) => {
    const { id } = req.params;
    const { eventId } = req.body;

    if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $addToSet: { eventRegistrations: { event: eventId } } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json({ message: "Error updating user", error });
    }
};

exports.addEventToCreatedUser = async (req, res) => {
    const { id } = req.params;
    const { eventID } = req.body;

    // console.log("User ID:", id);
    // console.log("Event ID:", eventID);

    try {
        if (!eventID) {
            return res.status(400).json({ message: "Event ID is required" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $addToSet: { eventCreated: { event: new mongoose.Types.ObjectId(eventID) } } },
            { new: true, runValidators: true }
        );

        // console.log("Updated User:", updatedUser);
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ message: "Error updating user", error });
    }
};
