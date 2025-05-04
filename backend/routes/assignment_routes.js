const express = require("express");
const { getAllAssignments, getAssignmentsByEventId, getAssignmentsByOrganiserId, makeAssignment, deleteAssignment } = require("../controller/assignment_controller");
const { authenticate } = require("../middleware/authMiddle");
const router = express.Router();

// Public route
router.get("/", getAllAssignments);

//protected routes
router.get("/event/:eId", authenticate, getAssignmentsByEventId);
router.get("/organiser/:organiserId", authenticate, getAssignmentsByOrganiserId);
router.post("/makeAssignment", authenticate, makeAssignment);
router.delete("/deleteAssignment", authenticate, deleteAssignment);

module.exports = router;