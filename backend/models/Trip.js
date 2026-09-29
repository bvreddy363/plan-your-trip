const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ["spot", "restaurant"], required: true },
    spotId: { type: mongoose.Schema.Types.ObjectId, ref: "TouristSpot" },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    order: { type: Number, required: true, min: 0 },
    startTime: { type: String, required: true, match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must use 24-hour HH:mm format"] },
    endTime: { type: String, required: true, match: [/^([01]\d|2[0-3]):[0-5]\d$/, "End time must use 24-hour HH:mm format"] },
  },
  { _id: false },
);

activitySchema.pre("validate", function validateActivity() {
  const hasSpot = Boolean(this.spotId);
  const hasRestaurant = Boolean(this.restaurantId);

  if ((this.kind === "spot" && (!hasSpot || hasRestaurant)) ||
      (this.kind === "restaurant" && (!hasRestaurant || hasSpot))) {
    this.invalidate("kind", "Activity must contain only the matching listing reference");
  }

  if (this.startTime && this.endTime && this.endTime <= this.startTime) {
    this.invalidate("endTime", "End time must be later than start time");
  }
});

const daySchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true, min: 1 },
    activities: { type: [activitySchema], default: [] },
  },
  { _id: false },
);

const tripSchema = new mongoose.Schema(
  {
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    startDate: { type: Date },
    numberOfDays: {
      type: Number,
      required: true,
      min: 1,
      validate: Number.isInteger,
    },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    days: { type: [daySchema], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Trip", tripSchema);