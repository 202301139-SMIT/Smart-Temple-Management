import mongoose from "mongoose";

const forecastRecordSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    predictedCount: {
      type: Number,
      required: true,
    },
    actualCount: {
      type: Number,
    },
    error: {
      type: Number,
    },
    percentageError: {
      type: Number,
    },
    mape: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "SKIPPED"],
      default: "PENDING",
    },
    createdFromDate: {
      type: Date,
      required: true,
    },
    completionDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    confidenceLevel: {
      type: String,
      enum: ["High", "Medium", "Low", "Estimate"],
      default: "High",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ForecastRecord = mongoose.model(
  "ForecastRecord",
  forecastRecordSchema
);
