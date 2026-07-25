import { ActualPilgrimCount } from "../models/actualPilgrimCount.model.js";
import { ForecastRecord } from "../models/forecastRecord.model.js";
import { normalizeToUTC, calculateMAPE, generateForecastRange } from "./forecast.service.js";
import { predictWithSarimax } from "../utils/sarimaxBridge.js";
import { isSimulationModeEnabled, getSimulatedDate } from "./simulation.service.js";

// Retroactively generate a forecast record if it doesn't exist
const ensureForecastRecordExists = async (targetDate, userId) => {
  let record = await ForecastRecord.findOne({ date: targetDate });
  if (record) return record;

  // Query latest actual before targetDate, bounded by simulated date if in simulation mode
  const filter = { date: { $lt: targetDate } };
  if (isSimulationModeEnabled()) {
    filter.date.$lte = getSimulatedDate();
  }

  const latestBefore = await ActualPilgrimCount.findOne(filter).sort({ date: -1 }).lean();

  const baseActualsFilter = {
    date: { $lt: targetDate, $gte: new Date("2025-06-07T00:00:00.000Z") }
  };
  if (isSimulationModeEnabled()) {
    baseActualsFilter.date.$lte = getSimulatedDate();
  }

  const baseActuals = await ActualPilgrimCount.find(baseActualsFilter).sort({ date: 1 }).lean();
  const appendedActuals = baseActuals.map((actual) => ({
    date: actual.date.toISOString().split("T")[0],
    actualCount: actual.count
  }));

  const predictedCount = await predictWithSarimax({
    appendActuals: appendedActuals.length > 0 ? appendedActuals : undefined,
    forecastStartDate: targetDate.toISOString().split("T")[0],
    steps: 1
  });

  record = await ForecastRecord.create({
    date: targetDate,
    predictedCount,
    createdFromDate: new Date(),
    createdBy: userId,
    status: "PENDING"
  });

  return record;
};

// Calculate and update the running MAPE for all completed records
// NOTE: No simulation date filter here — once a forecast is marked COMPLETED
// with a confirmed actual value, it must always be included in accuracy metrics.
// The simulation boundary only prevents future data from leaking into PREDICTIONS.
const updateRunningMape = async () => {
  const completed = await ForecastRecord.find({ status: "COMPLETED" }).sort({ date: 1 });
  let sumPercentageError = 0;
  for (let i = 0; i < completed.length; i++) {
    sumPercentageError += (completed[i].percentageError || 0);
    const runningMape = Number((sumPercentageError / (i + 1)).toFixed(2));
    completed[i].mape = runningMape;
    await completed[i].save();
  }
};

export const addActualCountService = async ({ date, actualCount, userId }) => {
  const targetDate = normalizeToUTC(date);

  // Check if actual count already exists
  const existingActual = await ActualPilgrimCount.findOne({ date: targetDate });
  if (existingActual) {
    throw new Error("Actual pilgrim count already exists for this date. Use update instead.");
  }

  // Create actual pilgrim count record
  const newActual = await ActualPilgrimCount.create({
    date: targetDate,
    count: actualCount,
    enteredBy: userId,
    source: "ADMIN_ENTRY"
  });

  // Ensure corresponding forecast record exists
  const forecastRecord = await ensureForecastRecordExists(targetDate, userId);

  // Calculate metrics
  const error = Math.abs(actualCount - forecastRecord.predictedCount);
  const percentageError = calculateMAPE(actualCount, forecastRecord.predictedCount);

  // Update forecast record
  forecastRecord.actualCount = actualCount;
  forecastRecord.error = error;
  forecastRecord.percentageError = percentageError;
  forecastRecord.status = "COMPLETED";
  forecastRecord.completedBy = userId;
  forecastRecord.completionDate = new Date();
  await forecastRecord.save();

  // Recalculate running MAPEs
  await updateRunningMape();

  // Trigger rolling update: pre-generate next 7 days of predictions starting tomorrow
  const tomorrow = new Date(targetDate);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const endDate = new Date(targetDate);
  endDate.setUTCDate(endDate.getUTCDate() + 7);
  await generateForecastRange(tomorrow, endDate, userId);

  // Reload forecast record to get updated running MAPE
  const updatedForecast = await ForecastRecord.findOne({ date: targetDate }).lean();

  return {
    actual: newActual,
    forecast: updatedForecast
  };
};

export const updateActualCountService = async ({ date, actualCount, userId }) => {
  const targetDate = normalizeToUTC(date);

  const actualRecord = await ActualPilgrimCount.findOne({ date: targetDate });
  if (!actualRecord) {
    throw new Error("Actual pilgrim count record not found for this date.");
  }

  // Update count
  actualRecord.count = actualCount;
  actualRecord.enteredBy = userId;
  await actualRecord.save();

  // Ensure forecast record exists
  const forecastRecord = await ensureForecastRecordExists(targetDate, userId);

  // Recalculate metrics
  const error = Math.abs(actualCount - forecastRecord.predictedCount);
  const percentageError = calculateMAPE(actualCount, forecastRecord.predictedCount);

  // Update forecast record
  forecastRecord.actualCount = actualCount;
  forecastRecord.error = error;
  forecastRecord.percentageError = percentageError;
  forecastRecord.status = "COMPLETED";
  forecastRecord.completedBy = userId;
  forecastRecord.completionDate = new Date();
  await forecastRecord.save();

  // Recalculate running MAPEs
  await updateRunningMape();

  // Trigger rolling update: pre-generate next 7 days of predictions starting tomorrow
  const tomorrow = new Date(targetDate);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const endDate = new Date(targetDate);
  endDate.setUTCDate(endDate.getUTCDate() + 7);
  await generateForecastRange(tomorrow, endDate, userId);

  const updatedForecast = await ForecastRecord.findOne({ date: targetDate }).lean();

  return {
    actual: actualRecord,
    forecast: updatedForecast
  };
};

export const getActualRecordsService = async () => {
  return ActualPilgrimCount.find({}).sort({ date: -1 }).populate("enteredBy", "name email role").lean();
};
