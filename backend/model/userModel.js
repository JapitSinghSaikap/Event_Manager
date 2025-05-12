const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['organiser', 'attendee', 'admin'],
        default: 'attendee',
        required: true
    },
    profilePic: {
        type: String,
        default: "",
        trim: true
    }, 
    eventRegistrations: [{
        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
        },
        ticketId: {
            type: String,
        },
        registrationDate: {
            type: Date,
            default: Date.now
        }
    }],
    eventCreated: [
        {
          event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
          },
        },
      ],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
