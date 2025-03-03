const express=require("express");
const router = express.Router();
const { getAll,postOrganiser,updateOrganiser,deleteOrganiser ,getOrganiserById,signup} = require("../controller/organiser_contoller");

router.get('/', getAll);
router.get('/:id', getOrganiserById);
router.post('/postOrganiser', postOrganiser);
router.put('/updateOrganiser/:id', updateOrganiser);
router.delete('/deleteOrganiser/:id', deleteOrganiser);

module.exports = router;