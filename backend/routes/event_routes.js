const express = require("express");
const router = express.Router();
const { getAllEvents, getEventById, postEvent, updateEvent, deleteEvent,registerForEvent,checkRegistrationStatus } = require("../controller/event_controller");
const { authenticate } = require("../middleware/authMiddle");

// Public route
router.get("/", getAllEvents);

//registration routes

router.post("/:id/register", authenticate, registerForEvent);
router.get("/:id/check-registration", authenticate, checkRegistrationStatus);

// Protected routes
router.get("/:id", authenticate, getEventById);
router.post("/postEvent", authenticate, postEvent);
router.put("/updateEvent/:id", authenticate, updateEvent);
router.delete("/:id", authenticate, deleteEvent);

module.exports = router;
