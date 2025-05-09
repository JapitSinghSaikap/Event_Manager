const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  postEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  checkRegistrationStatus,
  verifyTicket
} = require("../controller/event_controller");

const { addEventToUser, getAllUserEvents } = require("../controller/user_controller")

const { authenticate } = require("../middleware/authMiddle");

// Public route
router.get("/", getAllEvents);

// Registration routes
router.post("/:id/register", authenticate, registerForEvent);
router.get("/:id/check-registration", authenticate, checkRegistrationStatus);

// Add event to user
router.post("/:id/add-event-to-user", addEventToUser);
router.get("/:id/get-user-events", getAllUserEvents);

// Ticket verification
router.post("/:id/verify-ticket", authenticate, verifyTicket);

// Protected event routes
router.get("/:id", authenticate, getEventById);
router.post("/postEvent", authenticate, postEvent);
router.put("/:id", authenticate, updateEvent);
router.delete("/:id", authenticate, deleteEvent);

module.exports = router;
