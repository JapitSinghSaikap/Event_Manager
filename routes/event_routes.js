const express=require("express");
const router = express.Router();
const {getAllEvents,getEventById,postEvent,updateEvent,deleteEvent} = require("../controller/event_controller");

router.get("/",getAllEvents);
router.get("/:id",getEventById);
router.post("/postEvent",postEvent);
router.put("/updateEvent/:id",updateEvent);
router.delete("/deleteEvent/:id",deleteEvent);

module.exports = router;
