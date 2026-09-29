const mongoose = require("mongoose");
const Destination = require("../models/Destination");
const Hotel = require("../models/Hotel");
const Restaurant = require("../models/Restaurant");
const TouristSpot = require("../models/TouristSpot");
const Trip = require("../models/Trip");
const httpError = require("../utils/httpError");

function requireObjectBody(req) {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    throw httpError(400, "Request body must be a JSON object");
  }
}

function validateId(value, label) {
  if (!mongoose.isValidObjectId(value)) throw httpError(400, `Invalid ${label}`);
}

function validateDayCount(value) {
  const days = Number(value);
  if (!Number.isInteger(days) || days < 1) {
    throw httpError(400, "numberOfDays must be a positive whole number");
  }
  return days;
}

function makeEmptyDays(count) {
  return Array.from({ length: count }, (_, index) => ({ dayNumber: index + 1, activities: [] }));
}

function timeToMinutes(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function validateDays(days, numberOfDays) {
  if (!Array.isArray(days) || days.length !== numberOfDays) {
    throw httpError(400, "days must contain one entry for each trip day");
  }

  const seenActivities = new Set();
  return days.map((day, dayIndex) => {
    if (!day || Number(day.dayNumber) !== dayIndex + 1 || !Array.isArray(day.activities)) {
      throw httpError(400, "Trip days must be numbered in order and contain an activities array");
    }

    const scheduledTimes = [];
    const activities = day.activities.map((activity, activityIndex) => {
      if (!activity || typeof activity !== "object" || Array.isArray(activity)) {
        throw httpError(400, "Each activity must be a JSON object");
      }
      if (Number(activity.order) !== activityIndex) {
        throw httpError(400, "Activity order must be consecutive within each day");
      }

      const isSpot = activity.kind === "spot";
      const isRestaurant = activity.kind === "restaurant";
      if ((!isSpot && !isRestaurant) || (isSpot && (!activity.spotId || activity.restaurantId)) ||
          (isRestaurant && (!activity.restaurantId || activity.spotId))) {
        throw httpError(400, "Each activity must include only its matching listing ID");
      }

      const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
      if (typeof activity.startTime !== "string" || !timePattern.test(activity.startTime) ||
          typeof activity.endTime !== "string" || !timePattern.test(activity.endTime)) {
        throw httpError(400, "Each activity needs a start and end time in 24-hour HH:mm format");
      }
      const startMinutes = timeToMinutes(activity.startTime);
      const endMinutes = timeToMinutes(activity.endTime);
      if (endMinutes <= startMinutes) {
        throw httpError(400, "Activity end time must be later than start time on the same day");
      }
      if (scheduledTimes.some((time) => startMinutes < time.end && endMinutes > time.start)) {
        throw httpError(400, "Activities cannot overlap on the same day");
      }
      scheduledTimes.push({ start: startMinutes, end: endMinutes });

      const itemId = isSpot ? activity.spotId : activity.restaurantId;
      validateId(itemId, "activity listing ID");
      const duplicateKey = `${activity.kind}:${itemId}`;
      if (seenActivities.has(duplicateKey)) throw httpError(400, "An activity cannot be added to a trip more than once");
      seenActivities.add(duplicateKey);

      return {
        kind: activity.kind,
        spotId: isSpot ? itemId : undefined,
        restaurantId: isRestaurant ? itemId : undefined,
        order: activityIndex,
        startTime: activity.startTime,
        endTime: activity.endTime,
      };
    });

    return { dayNumber: dayIndex + 1, activities };
  });
}

function validateStartDate(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw httpError(400, "startDate must be a valid date");
  return date;
}

async function verifyReferences(destinationId, hotelId, days) {
  const destination = await Destination.findById(destinationId).select("_id");
  if (!destination) throw httpError(404, "Destination not found");

  if (hotelId) {
    validateId(hotelId, "hotel ID");
    const hotel = await Hotel.findOne({ _id: hotelId, destinationId }).select("_id");
    if (!hotel) throw httpError(400, "Selected hotel must belong to the trip destination");
  }

  const spotIds = [];
  const restaurantIds = [];
  for (const day of days) {
    for (const activity of day.activities) {
      if (activity.kind === "spot") spotIds.push(activity.spotId);
      else restaurantIds.push(activity.restaurantId);
    }
  }

  const [spots, restaurants] = await Promise.all([
    TouristSpot.find({ _id: { $in: spotIds }, destinationId }).select("_id"),
    Restaurant.find({ _id: { $in: restaurantIds }, destinationId }).select("_id"),
  ]);
  if (spots.length !== new Set(spotIds.map(String)).size ||
      restaurants.length !== new Set(restaurantIds.map(String)).size) {
    throw httpError(400, "Selected activities must belong to the trip destination");
  }
}

async function getPopulatedTrip(id) {
  return Trip.findById(id)
    .populate("destinationId", "name slug country image imageCredit imageLicense imageLicenseUrl imageSourceUrl")
    .populate("hotelId", "name rating priceRange location image")
    .populate("days.activities.spotId", "name description image imageCredit imageLicense imageLicenseUrl imageSourceUrl rating duration")
    .populate("days.activities.restaurantId", "name cuisine image imageCredit imageLicense imageLicenseUrl imageSourceUrl rating location");
}

async function createTrip(req, res) {
  requireObjectBody(req);
  const destinationId = req.body.destinationId;
  validateId(destinationId, "destination ID");
  const numberOfDays = validateDayCount(req.body.numberOfDays);
  const hotelId = req.body.hotelId || undefined;
  const days = req.body.days === undefined ? makeEmptyDays(numberOfDays) : validateDays(req.body.days, numberOfDays);
  const startDate = validateStartDate(req.body.startDate);

  await verifyReferences(destinationId, hotelId, days);
  const trip = await Trip.create({ destinationId, numberOfDays, hotelId, startDate, days });
  res.status(201).json({ success: true, data: await getPopulatedTrip(trip._id) });
}

async function getTrip(req, res) {
  validateId(req.params.id, "trip ID");
  const trip = await getPopulatedTrip(req.params.id);
  if (!trip) throw httpError(404, "Trip not found");
  res.json({ success: true, data: trip });
}

async function updateTrip(req, res) {
  requireObjectBody(req);
  validateId(req.params.id, "trip ID");
  const trip = await Trip.findById(req.params.id);
  if (!trip) throw httpError(404, "Trip not found");

  const destinationId = req.body.destinationId || trip.destinationId;
  validateId(destinationId, "destination ID");
  const numberOfDays = validateDayCount(req.body.numberOfDays ?? trip.numberOfDays);
  const hotelId = Object.hasOwn(req.body, "hotelId") ? req.body.hotelId || undefined : trip.hotelId;
  let days;

  if (req.body.days !== undefined) {
    days = validateDays(req.body.days, numberOfDays);
  } else {
    days = trip.days.map((day, index) => ({ dayNumber: index + 1, activities: day.activities }));
    if (numberOfDays < days.length && days.slice(numberOfDays).some((day) => day.activities.length > 0)) {
      throw httpError(400, "Move or remove activities from the days being removed first");
    }
    days = days.slice(0, numberOfDays);
    while (days.length < numberOfDays) days.push({ dayNumber: days.length + 1, activities: [] });
  }

  const startDate = Object.hasOwn(req.body, "startDate")
    ? validateStartDate(req.body.startDate)
    : trip.startDate;
  await verifyReferences(destinationId, hotelId, days);

  trip.destinationId = destinationId;
  trip.numberOfDays = numberOfDays;
  trip.hotelId = hotelId;
  trip.startDate = startDate;
  trip.days = days;
  await trip.save();
  res.json({ success: true, data: await getPopulatedTrip(trip._id) });
}

async function deleteTrip(req, res) {
  validateId(req.params.id, "trip ID");
  const trip = await Trip.findByIdAndDelete(req.params.id);
  if (!trip) throw httpError(404, "Trip not found");
  res.json({ success: true, data: { id: req.params.id } });
}

module.exports = { createTrip, getTrip, updateTrip, deleteTrip };