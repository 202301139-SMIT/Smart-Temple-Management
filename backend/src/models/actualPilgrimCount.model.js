import mongoose from "mongoose";

const actualPilgrimCountSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    count: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: ["ADMIN_ENTRY", "IMPORT"],
      default: "ADMIN_ENTRY",
    },
    enteredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const ActualPilgrimCount = mongoose.model(
  "ActualPilgrimCount",
  actualPilgrimCountSchema
);
