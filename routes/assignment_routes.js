const express=require("express");
const { getAllAssignments, getAssignmentsByEventId, getAssignmentsByOrganiserId, makeAssignment, deleteAssignment } = require("../controller/assignment_controller");
const router =express.Router();

router.get("/",getAllAssignments);
router.get("/event/:eId",getAssignmentsByEventId);
router.get("/organiser/:organiserId",getAssignmentsByOrganiserId);
router.post("/makeAssignment",makeAssignment);
router.delete("/deleteAssignment",deleteAssignment);

module.exports = router;