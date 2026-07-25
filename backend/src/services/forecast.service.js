import { ForecastRecord } from "../models/forecastRecord.model.js";
import { ActualPilgrimCount } from "../models/actualPilgrimCount.model.js";
import { predictWithSarimax } from "../utils/sarimaxBridge.js";
import { isSimulationModeEnabled, getSimulatedDate } from "./simulation.service.js";

// Helper to normalize any date input to UTC midnight Date object
export const normalizeToUTC = (dateInput) => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
};

// Format Date object to YYYY-MM-DD UTC string
export const formatUTCDate = (date) => {
  if (!date || isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

export const calculateMAPE = (actual, predicted) => {
  if (actual === 0) {
    return predicted === 0 ? 0 : 100;
  }
  return Number(((Math.abs(actual - predicted) / actual) * 100).toFixed(2));
};

// Start date of the rolling forecast system (sequence transition)
const ROLLING_START_DATE = new Date("2025-06-07T00:00:00.000Z");
const BASE_ACTUAL_DATE = new Date("2025-06-06T00:00:00.000Z");

// Retrieve all actual pilgrim counts from 2025-06-01 onwards, sorted by date ascending (filtering future data in simulation mode)
export const getAppendedActualCounts = async () => {
  const filter = { date: { $gte: ROLLING_START_DATE } };
  if (isSimulationModeEnabled()) {
    filter.date.$lte = getSimulatedDate();
  }
  const actuals = await ActualPilgrimCount.find(filter).sort({ date: 1 }).lean();
  return actuals.map(a => a.count);
};

export const getAppendedActuals = async () => {
  const filter = { date: { $gte: ROLLING_START_DATE } };
  if (isSimulationModeEnabled()) {
    filter.date.$lte = getSimulatedDate();
  }
  const actuals = await ActualPilgrimCount.find(filter).sort({ date: 1 }).lean();
  return actuals.map((actual) => ({
    date: formatUTCDate(actual.date),
    actualCount: actual.count,
  }));
};

// Retrieve the date of the latest actual pilgrim count in the database (filtering future data in simulation mode)
export const getLatestActualDate = async () => {
  const filter = { date: { $gte: ROLLING_START_DATE } };
  if (isSimulationModeEnabled()) {
    filter.date.$lte = getSimulatedDate();
  }
  const latest = await ActualPilgrimCount.findOne(filter).sort({ date: -1 }).lean();
  return latest ? latest.date : BASE_ACTUAL_DATE;
};

// Predict and save forecasts for a range of dates relative to the latest actual count
export const generateForecastRange = async (startStepDate, endStepDate, userId, skipAppend = false) => {
  const latestActualDate = await getLatestActualDate();
  const appendedActuals = skipAppend ? [] : await getAppendedActuals();

  const start = normalizeToUTC(startStepDate);
  const end = normalizeToUTC(endStepDate);

  const diffMs = end.getTime() - latestActualDate.getTime();
  const maxSteps = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (maxSteps < 1) {
    return [];
  }

  // Call SARIMAX model to forecast maxSteps ahead
  const predictions = await predictWithSarimax({
    appendActuals: appendedActuals.length > 0 ? appendedActuals : undefined,
    forecastStartDate: formatUTCDate(start),
    steps: maxSteps
  });

  const results = [];
  const startOffset = Math.round((start.getTime() - latestActualDate.getTime()) / (1000 * 60 * 60 * 24));

  for (let i = startOffset; i <= maxSteps; i++) {
    if (i < 1) continue;
    const targetDate = new Date(latestActualDate);
    targetDate.setUTCDate(targetDate.getUTCDate() + i);

    const predictedCount = Array.isArray(predictions) ? predictions[i - 1] : predictions;
    const confidenceLevel = i === 1 ? "High" : "Estimate";

    // Create or update the pending forecast record
    const forecast = await ForecastRecord.findOneAndUpdate(
      { date: targetDate },
      {
        date: targetDate,
        predictedCount,
        confidenceLevel,
        createdFromDate: new Date(),
        createdBy: userId,
        $setOnInsert: { status: "PENDING" }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    results.push(forecast);
  }

  return results;
};

// Get tomorrow's forecast
export const getTomorrowForecast = async (userId) => {
  let baseDate;
  if (isSimulationModeEnabled()) {
    baseDate = getSimulatedDate();
  } else {
    baseDate = await getLatestActualDate();
  }

  const tomorrowDate = new Date(baseDate);
  tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);

  // Check if tomorrow's forecast already exists
  let forecast = await ForecastRecord.findOne({ date: tomorrowDate });
  if (!forecast || forecast.status === "PENDING") {
    const generated = await generateForecastRange(tomorrowDate, tomorrowDate, userId, true);
    forecast = generated[0] || forecast;
  }

  return forecast;
};

// Get next 7 day forecast (including tomorrow)
export const getNext7DaysForecast = async (userId) => {
  let baseDate;
  if (isSimulationModeEnabled()) {
    baseDate = getSimulatedDate();
  } else {
    baseDate = await getLatestActualDate();
  }

  const tomorrowDate = new Date(baseDate);
  tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);

  const endDate = new Date(baseDate);
  endDate.setUTCDate(endDate.getUTCDate() + 7);

  await generateForecastRange(tomorrowDate, endDate, userId, false);

  const forecasts = await ForecastRecord.find({
    date: { $gte: tomorrowDate, $lte: endDate }
  }).sort({ date: 1 }).lean();

  // Add the estimate warning to records beyond tomorrow
  return forecasts.map((record) => {
    const isBeyondTomorrow = normalizeToUTC(record.date).getTime() > tomorrowDate.getTime();
    return {
      ...record,
      status: record.status === "COMPLETED" ? "ACTUAL" : "PREDICTED",
      warning: isBeyondTomorrow 
        ? "Forecasts beyond tomorrow are estimates and become less accurate as forecast horizon increases." 
        : undefined
    };
  });
};

// Get all forecast history with appropriate ACTUAL/PREDICTED status mapping
export const getForecastHistoryService = async () => {
  const filter = {};
  if (isSimulationModeEnabled()) {
    const tomorrowDate = new Date(getSimulatedDate());
    tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);
    filter.date = { $lte: tomorrowDate };
  }

  const records = await ForecastRecord.find(filter).sort({ date: -1 }).lean();
  const latestActualDate = await getLatestActualDate();
  const tomorrowDate = new Date(isSimulationModeEnabled() ? getSimulatedDate() : latestActualDate);
  tomorrowDate.setUTCDate(tomorrowDate.getUTCDate() + 1);

  return records.map((record) => {
    const isBeyondTomorrow = normalizeToUTC(record.date).getTime() > tomorrowDate.getTime();
    return {
      ...record,
      status: record.status === "COMPLETED" ? "ACTUAL" : "PREDICTED",
      warning: isBeyondTomorrow 
        ? "Forecasts beyond tomorrow are estimates and become less accurate as forecast horizon increases." 
        : undefined
    };
  });
};

// Get accuracy metrics (overall MAPE, running errors, etc.)
export const getForecastMetricsService = async () => {
  const filter = { status: "COMPLETED" };
  if (isSimulationModeEnabled()) {
    filter.date = { $lte: getSimulatedDate() };
  }

  const completed = await ForecastRecord.find(filter)
    .sort({ date: 1 })
    .lean();

  if (completed.length === 0) {
    return {
      averageMape: 0,
      averageAbsoluteError: 0,
      totalCompleted: 0,
      history: []
    };
  }

  const sumMape = completed.reduce((sum, r) => sum + (r.percentageError || 0), 0);
  const sumAbsError = completed.reduce((sum, r) => sum + (r.error || 0), 0);

  const averageMape = Number((sumMape / completed.length).toFixed(2));
  const averageAbsoluteError = Number((sumAbsError / completed.length).toFixed(2));

  return {
    averageMape,
    averageAbsoluteError,
    totalCompleted: completed.length,
    history: completed.map(r => ({
      date: r.date,
      predictedCount: r.predictedCount,
      actualCount: r.actualCount,
      absoluteError: r.error,
      percentageError: r.percentageError,
      runningMape: r.mape
    }))
  };
};
