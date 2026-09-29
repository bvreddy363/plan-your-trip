const express = require("express");
const controller = require("../controllers/destinationController");

const router = express.Router();

router.get("/", controller.listDestinations);
router.get("/search", controller.searchDestinations);
router.get("/:destinationId/spots", controller.listSpots);
router.get("/:destinationId/hotels", controller.listHotels);
router.get("/:destinationId/restaurants", controller.listRestaurants);
router.get("/:destinationId", controller.getDestination);

module.exports = router;