const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    country: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    bestTimeToVisit: {
      from: { type: String, trim: true },
      to: { type: String, trim: true },
    },
    image: { type: String, trim: true },
    imageCredit: { type: String, trim: true },
    imageLicense: { type: String, trim: true },
    imageLicenseUrl: { type: String, trim: true },
    imageSourceUrl: { type: String, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Destination", destinationSchema);