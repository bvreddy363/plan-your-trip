const mongoose = require("mongoose");

const touristSpotSchema = new mongoose.Schema(
  {
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    rating: { type: Number, min: 0, max: 5 },
    duration: { type: String, trim: true },
    bestTimeToVisit: { type: String, trim: true },
    entryFee: { type: Number, min: 0 },
    image: { type: String, trim: true },
    imageCredit: { type: String, trim: true },
    imageLicense: { type: String, trim: true },
    imageLicenseUrl: { type: String, trim: true },
    imageSourceUrl: { type: String, trim: true },
  },
  { timestamps: true },
);

touristSpotSchema.index({ destinationId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("TouristSpot", touristSpotSchema);