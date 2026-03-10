import mongoose from "mongoose";

const contactCardSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    detail: { type: String, required: true, trim: true },
  },
  { _id: false },
);

export const siteContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    contactCards: {
      type: [contactCardSchema],
      default: [],
    },
    supportWindowTitle: {
      type: String,
      default: "",
      trim: true,
    },
    supportWindowHeading: {
      type: String,
      default: "",
      trim: true,
    },
    supportWindowDescription: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const SiteContent = mongoose.models.SiteContent || mongoose.model("SiteContent", siteContentSchema);
