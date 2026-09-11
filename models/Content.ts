import mongoose, { Schema, models } from "mongoose";

const ContentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: String,
      default: "",
      trim: true,
    },

    weight: {
      type: String,
      default: "",
      trim: true,
    },

    cacao: {
      type: String,
      default: "",
      trim: true,
    },

    style: {
      type: String,
      default: "",
      trim: true,
    },

    ferment: {
      type: String,
      default: "",
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

const Content =
  mongoose.models.Content ||
  mongoose.model("Content", ContentSchema);

export default Content;