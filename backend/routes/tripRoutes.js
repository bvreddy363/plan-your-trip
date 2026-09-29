const express = require("express");
const controller = require("../controllers/tripController");

const router = express.Router();

router.post("/", controller.createTrip);
router.get("/:id", controller.getTrip);
router.put("/:id", controller.updateTrip);
router.delete("/:id", controller.deleteTrip);

module.exports = router;