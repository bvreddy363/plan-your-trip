const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    rating: { type: Number, min: 0, max: 5 },
    priceRange: {
      min: { type: Number, required: true, min: 0 },
      max: { type: Number, required: true, min: 0 },
    },
    location: { type: String, required: true, trim: true },
    image: { type: String, trim: true },
    imageCredit: { type: String, trim: true },
    imageLicense: { type: String, trim: true },
    imageLicenseUrl: { type: String, trim: true },
    imageSourceUrl: { type: String, trim: true },
  },
  { timestamps: true },
);

hotelSchema.path("priceRange.max").validate(function validatePriceRange(max) {
  const minimum = this instanceof mongoose.Query
    ? this.get("priceRange.min") ?? this.get("priceRange")?.min
    : this.priceRange?.min;
  return Number.isFinite(Number(minimum)) && max >= Number(minimum);
}, "Maximum price must be at least the minimum price");
hotelSchema.index({ destinationId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Hotel", hotelSchema);