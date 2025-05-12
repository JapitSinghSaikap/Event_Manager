const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, "Title is required"],
    trim: true
  },
  description: { 
    type: String, 
    required: [true, "Description is required"],
    trim: true
  },
  type: { 
    type: String, 
    enum: ["conference", "hackathon", "workshop", "meetup"],
    required: true
  },
  format: { 
    type: String, 
    enum: ["in-person", "virtual", "hybrid"],
    required: true
  },
  technologies: {
    type: [String],
    default: []
  },
  price : {
    type: Number,
    default: 0,
    min: [0, "Price cannot be negative"]
  },
  startDate: { 
    type: Date,
    required: true 
  },
  endDate: { 
    type: Date,
    required: true 
  },
  location: { 
    type: String,
    trim: true,
    default: ""
  },
  organiser: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  imageUrl: { 
    type: String,
    trim: true,
    default: ""
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    ticketId: {
      type: String,
      required: true
    },
    checkedIn: {
      type: Boolean,
      default: false
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model("Event", eventSchema);
