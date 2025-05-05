const express = require("express");
const { connectDB } = require("./lib/db");
require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json()); // important for parsing JSON bodies

connectDB();

const port = process.env.PORT || 5000;

const organiserRoutes = require("./routes/organiser_routes");
const eventRoutes = require("./routes/event_routes");
const assignmentRoutes = require("./routes/assignment_routes");
// app.use(express.static("public"));//yeh html page pe data dikhana hoga 
// app.use("/uploads", express.static("uploads"));



app.use("/organisers", organiserRoutes);
app.use("/events", eventRoutes);
app.use("/assignments", assignmentRoutes);


    


app.listen(port, () => {
    console.log(`Server started at ${port}`);
});


// const express = require("express");
// // const cors = require("cors");
// const app = express();
// app.use(express.json()); //middleware not using body-parser just for now
// const port = 3000;

// let events = [];
// let organisers = [];
// let assignments = [];

// //trying to give unique for each event so that i can retrieve an event just by id too
// const generateId = () => Math.floor(Math.random() * 1000000);


// //Resources

// //retrieve all resources(events)
// app.get("/events", (req, res) => {
//     return res.status(200).json(events);
// })


// //retrieving by id
// app.get("/events/:id", (req, res) => {
//     const id = parseInt(req.params.id);
//     const event = events.find(e => e.id === id);
//     if (!event) {
//         return res.status(404).json({ message: "Event not found" });
//     }
//     return res.status(200).json(event);
// })

// //posting an event
// app.post("/postEvent", (req, res) => {
//     const { name, date, location, description } = req.body;
//     if (!name || !date || !location || !description) {
//         return res.status(400).json({ message: "All event fields are required" });
//     }
//     const newEvent = {
//         id: generateId(),
//         name,
//         date,
//         location,
//         description,
//     }
//     console.log("event ID:",newEvent.id);
//     events.push(newEvent);
//     return res.status(200).json(events);
// })

// //updating an event by id
// app.put("/updateEvent/:id", (req, res) => {
//     const id = parseInt(req.params.id);
//     const { name, date, location, description } = req.body;
//     if (!name || !date || !location || !description) {
//         return res.status(400).json({ message: "All event fields are required" });
//     }
//     const index = events.findIndex(e => e.id === id);
//     if (index === -1) {
//         return res.status(400).json({ message: "Event not found" });
//     }
//     events[index] = { id, name, date, location, description };
//     //for the updated event
//     return res.status(200).json(events[index]);
// })

// //deleted event
// app.delete("/deleteEvent/:id", (req, res) => {
//     const id = parseInt(req.params.id);
//     const index = events.findIndex(e => e.id === id);
//     if (index === -1) {
//         return res.status(400).json({message:"Event not found!!!"});
//     }
//     events.splice(index, 1);
//     return res.status(200).json({message:"Event succesfully deleted!!!"});
// })


// //The Users i.e the organisers
  
// //for the organisers now
// app.get("/organisers", (req, res) => {
//     return res.status(200).json(organisers);
// })

// app.get("/organisers/:id", (req, res) => {
//     const id = parseInt(req.params.id);
//     const organiser = organisers.find(o => o.id === id);
//     if (!organiser) {
//         return res.status(400).json({message:"Organiser not found"} );
//     }
//     return res.status(200).json(organiser);
// })

// app.post("/postOrganiser", (req, res) => {
//     const { name, email, role } = req.body;
//     if (!name || !email || !role) {
//         return res.status(400).json({message:"All organiser fields are required"} );
//     }
//     const newOrganiser = {
//         id: generateId(),
//         name,
//         email,
//         role
//     }
//     console.log("organiser ID:",newOrganiser.id);
//     organisers.push(newOrganiser);
//     return res.status(200).json(organisers);
// })

// app.put("/updateOrganiser/:id", (req, res) => {
//     const id = parseInt(req.params.id);
//     const { name, email, role } = req.body;
//     if (!name || !email || !role) {
//         return res.status(400).json({message:"All organiser fields are required"});
//     }
//     const index = organisers.findIndex(o => o.id === id);
//     if (index === -1) {
//         return res.status(400).json("Organiser not found");
//     }
//     //is index pe change hua hai arr organisers wali mein
//     organisers[index] = { id, name, email, role };
//     //for the updated event
//     return res.status(200).json(organisers[index]);
// })

// app.delete("/deleteOrganiser/:id", (req, res) => {
//     const id = parseInt(req.params.id);
//     const index = organisers.findIndex(o => o.id === id);
//     if (index === -1) {
//       return res.status(400).json({message:"Organiser not found!!!"});
//     }
//     organisers.splice(index, 1);
//     return res.status(200).json({message:"Organiser successfully deleted!!!"});
// });


// //The Relationship

// //the realtion between the events and organsisers which have been already made i.e the assignments of the event to the organisers

// //get all the event assignments made to organisers
// app.get("/eventAssignments", (req, res) => {
//   return res.status(200).json(assignments);
// });


// //get assignments by the event id
// app.get("/eventAssignments/event/:eId", (req, res) => {
//     const eId = parseInt(req.params.eId);
//     const byEventId = assignments.filter(a => a.eId === eId);
//     return res.status(200).json(byEventId);
// });
  
// //getting the assignments by the organisers id
// app.get("/eventAssignments/organiser/:organiserId", (req, res) => {
//     const organiserId = parseInt(req.params.organiserId);
//     const byOrganiserId = assignments.filter(a => a.organiserId === organiserId);
//     return res.status(200).json(byOrganiserId);
// });
  

// //making assignment postings
// app.post("/assignmentPosts", (req, res) => {
//   const { eId, oId } = req.body;
//   const event = events.find(e => e.id === eId);
//   if (!event) {
//     return res.status(400).json({message:"Event not found"});
//   }
//   const organiser = organisers.find(o => o.id === oId);
//   if (!organiser) {
//     return res.status(400).json({message:"Organiser not found"});
//   }
//   //yeh taki duplicate assignments na ho
//   const duplicate = assignments.find(a => a.eId === eId && a.oId === oId);
//   if (duplicate) {
//     return res.status(400).json({message:"Assignment already exists"});
//   }
//   const newAssignment = { eId, oId, eventName: event.name };
//   assignments.push(newAssignment);
//   console.log(newAssignment);
//   return res.status(201).json(newAssignment);
// });


// //deleting the assignments
// app.delete("/assignments", (req, res) => {
//   const { eId, oId } = req.body;
//   const index = assignments.findIndex(a => a.eId === eId && a.oId === oId);
//   if (index === -1) {
//     return res.status(400).json({message:"Assignment not found"});
//   }
//   assignments.splice(index, 1);
//   return res.status(200).json({message:"Assignment successfully deleted"});
// });


// app.listen(port, () => {
//     console.log(`Server started at ${port}`);
// });
