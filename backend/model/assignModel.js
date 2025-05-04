const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
    eventId:
     { type: mongoose.Schema.Types.ObjectId, 
       ref: "Event",//event collection name
       required: true 
    },
    organiserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    assignedAt: { 
        type: Date,
        default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);