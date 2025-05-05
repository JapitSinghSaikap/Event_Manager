const User = require("../model/userModel");


exports.getAllUserEvents = async (req,res) => {
    try {
        const userId = req.params.id; // Assuming the user ID is passed as a URL parameter
        const user = await User.findById(userId).populate("eventRegistrations.event", "title startDate endDate location description");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const events = user.eventRegistrations.map(registration => registration.event);
        return res.status(200).json(events);
    
    }
    catch(error){
        return res.status(500).json({ message: "Error fetching user events", error });
    }
}

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

