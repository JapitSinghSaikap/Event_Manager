const express = require("express");
const router = express.Router();
const { getAll, postOrganiser, updateOrganiser, deleteOrganiser, getOrganiserById,signup,login, getAllRegisteredEvents , getAllCreatedEvents} = require("../controller/organiser_contoller");
const { authenticate } = require("../middleware/authMiddle");

// Public route
router.get('/', getAll);
router.post("/signup",signup);
router.post("/login",login);

// get current events created by the organiser 
router.get("/getOrganiserEvent",authenticate, getAllRegisteredEvents);
router.get("/getCreatedEvents",authenticate, getAllCreatedEvents); 

// get events joied by the organiser 

// Protected routes
router.get('/:id', authenticate, getOrganiserById);
router.post('/postOrganiser', authenticate, postOrganiser);
router.put('/updateOrganiser/:id', authenticate, updateOrganiser);
router.delete('/deleteOrganiser/:id', authenticate, deleteOrganiser);



module.exports = router;