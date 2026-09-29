const mongoose = require("mongoose");
const Destination = require("../models/Destination");
const Hotel = require("../models/Hotel");
const Restaurant = require("../models/Restaurant");
const TouristSpot = require("../models/TouristSpot");
const httpError = require("../utils/httpError");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parsePrice(value, name) {
  if (value === undefined || value === "") return undefined;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    throw httpError(400, `${name} must be a non-negative number`);
  }
  return number;
}

async function getDestinationOrThrow(id) {
  if (!mongoose.isValidObjectId(id)) throw httpError(400, "Invalid destination ID");
  const destination = await Destination.findById(id);
  if (!destination) throw httpError(404, "Destination not found");
  return destination;
}

async function listDestinations(req, res) {
  const destinations = await Destination.find().sort({ name: 1 });
  res.json({ success: true, data: destinations });
}

async function searchDestinations(req, res) {
  const name = req.query.name?.trim();
  if (!name) throw httpError(400, "Enter a destination name to search");

  const destinations = await Destination.find({
    name: { $regex: escapeRegex(name), $options: "i" },
  }).sort({ name: 1 });

  res.json({ success: true, data: destinations });
}

async function getDestination(req, res) {
  const destination = await getDestinationOrThrow(req.params.destinationId);
  res.json({ success: true, data: destination });
}

async function listSpots(req, res) {
  await getDestinationOrThrow(req.params.destinationId);
  const spots = await TouristSpot.find({ destinationId: req.params.destinationId }).sort({ name: 1 });
  res.json({ success: true, data: spots });
}

async function listHotels(req, res) {
  await getDestinationOrThrow(req.params.destinationId);
  const minPrice = parsePrice(req.query.minPrice, "minPrice");
  const maxPrice = parsePrice(req.query.maxPrice, "maxPrice");
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    throw httpError(400, "minPrice must not exceed maxPrice");
  }

  const filter = { destinationId: req.params.destinationId };
  if (minPrice !== undefined) filter["priceRange.max"] = { $gte: minPrice };
  if (maxPrice !== undefined) filter["priceRange.min"] = { $lte: maxPrice };

  let query = Hotel.find(filter);
  if (req.query.sort === "rating") query = query.sort({ rating: -1, name: 1 });
  else query = query.sort({ name: 1 });

  res.json({ success: true, data: await query });
}

async function listRestaurants(req, res) {
  await getDestinationOrThrow(req.params.destinationId);
  const minPrice = parsePrice(req.query.minPrice, "minPrice");
  const maxPrice = parsePrice(req.query.maxPrice, "maxPrice");
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    throw httpError(400, "minPrice must not exceed maxPrice");
  }

  const filter = { destinationId: req.params.destinationId };
  if (minPrice !== undefined) filter["priceRange.max"] = { $gte: minPrice };
  if (maxPrice !== undefined) filter["priceRange.min"] = { $lte: maxPrice };
  if (req.query.cuisine?.trim()) {
    filter.cuisine = { $regex: `^${escapeRegex(req.query.cuisine.trim())}$`, $options: "i" };
  }

  let query = Restaurant.find(filter);
  if (req.query.sort === "rating") query = query.sort({ rating: -1, name: 1 });
  else query = query.sort({ name: 1 });

  res.json({ success: true, data: await query });
}

module.exports = {
  listDestinations,
  searchDestinations,
  getDestination,
  listSpots,
  listHotels,
  listRestaurants,
};