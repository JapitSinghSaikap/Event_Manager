const express = require("express");
const router = express.Router();
const { getAll, postOrganiser, updateOrganiser, deleteOrganiser, getOrganiserById,signup,login } = require("../controller/organiser_contoller");
const { authenticate } = require("../middleware/authMiddle");

// Public route
router.get('/', getAll);
router.post("/signup",signup);
router.post("/login",login);

// Protected routes
router.get('/:id', authenticate, getOrganiserById);
router.post('/postOrganiser', authenticate, postOrganiser);
router.put('/updateOrganiser/:id', authenticate, updateOrganiser);
router.delete('/deleteOrganiser/:id', authenticate, deleteOrganiser);



module.exports = router;