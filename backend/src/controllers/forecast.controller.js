import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ForecastRecord } from "../models/forecastRecord.model.js";
import { ActualPilgrimCount } from "../models/actualPilgrimCount.model.js";
import { User } from "../models/user.model.js";
import {
  getTomorrowForecast,
  getNext7DaysForecast,
  getForecastHistoryService,
  getForecastMetricsService,
  generateForecastRange,
  getLatestActualDate,
  getAppendedActualCounts
} from "../services/forecast.service.js";
import { addActualCountService } from "../services/actuals.service.js";
import { isSimulationModeEnabled, getSimulatedDate, setSimulationConfig } from "../services/simulation.service.js";

// GET /api/v1/forecast/tomorrow
export const getTomorrowPrediction = asyncHandler(async (req, res) => {
  const forecast = await getTomorrowForecast(req.user._id);
  return res.status(200).json(
    new ApiResponse(200, { forecast }, "Tomorrow forecast fetched successfully")
  );
});

// GET /api/v1/forecast/next-7-days
export const getNext7DayForecast = asyncHandler(async (req, res) => {
  const forecast = await getNext7DaysForecast(req.user._id);
  const tomorrow = forecast[0];
  const next7Days = forecast;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        tomorrow: tomorrow ? {
          date: tomorrow.date,
          predictedCount: tomorrow.predictedCount,
          confidenceLevel: tomorrow.confidenceLevel
        } : null,
        forecast: next7Days,
        warning: "Forecasts beyond tomorrow are estimates and become less accurate as forecast horizon increases."
      },
      "Next 7 days forecast fetched successfully"
    )
  );
});

// GET /api/v1/forecast/history
export const getForecastHistory = asyncHandler(async (req, res) => {
  const history = await getForecastHistoryService();
  return res.status(200).json(
    new ApiResponse(200, { history }, "Forecast history fetched successfully")
  );
});

// GET /api/v1/forecast/metrics
export const getForecastMetrics = asyncHandler(async (req, res) => {
  const metrics = await getForecastMetricsService();
  return res.status(200).json(
    new ApiResponse(200, { metrics }, "Forecast metrics fetched successfully")
  );
});

// POST /api/v1/forecast/actual (preserved for backward compatibility)
export const enterActualCount = asyncHandler(async (req, res) => {
  const { date, actualCount } = req.body;
  const result = await addActualCountService({ date, actualCount: Number(actualCount), userId: req.user._id });
  return res.status(200).json(
    new ApiResponse(200, {
      forecast: result.forecast,
      nextForecast: result.forecast // return forecast as nextForecast for backward compatibility
    }, "Actual count entered and rolling forecast updated successfully")
  );
});

// POST /api/v1/forecast/import
export const importActual = asyncHandler(async (req, res) => {
  const { date, actualCount } = req.body;
  const result = await addActualCountService({ date, actualCount: Number(actualCount), userId: req.user._id });
  return res.status(200).json(
    new ApiResponse(200, {
      actual: result.actual,
      nextForecast: result.forecast
    }, "Actual imported and rolling forecast updated")
  );
});

// POST /api/v1/forecast/import-history
export const importActualHistory = asyncHandler(async (req, res) => {
  const { actuals } = req.body;

  if (!Array.isArray(actuals) || actuals.length === 0) {
    throw new ApiError(400, "actuals array is required");
  }

  // Add all actuals sequentially
  for (const item of actuals) {
    try {
      await addActualCountService({
        date: item.date,
        actualCount: Number(item.actualCount),
        userId: req.user._id
      });
    } catch (err) {
      // If it already exists, ignore or update it
      if (err.message.includes("already exists")) {
        // We can ignore or update
      } else {
        throw err;
      }
    }
  }

  const latestActualDate = await getLatestActualDate();
  const tomorrow = new Date(latestActualDate);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  const tomorrowForecast = await getTomorrowForecast(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, {
      imported: actuals.length,
      nextForecast: tomorrowForecast
    }, "History imported successfully and rolling forecast updated")
  );
});

// POST /api/v1/forecast/import-csv
export const importCsvHistory = asyncHandler(async (req, res) => {
  const { source, startDate, endDate } = req.body;
  const csvFileMap = {
    "tirupati_post_covid_processed.csv": "../forecaste_model/tirupati_post_covid_processed.csv",
  };

  const csvPath = csvFileMap[source];
  if (!csvPath) {
    throw new ApiError(400, "Unsupported CSV source");
  }

  const { default: path } = await import("path");
  const { default: fs } = await import("fs");
  const { default: csvParser } = await import("csv-parse/lib/sync.js");

  const absolutePath = path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    csvPath
  );

  if (!fs.existsSync(absolutePath)) {
    throw new ApiError(500, `CSV file not found: ${source}`);
  }

  const fileContents = fs.readFileSync(absolutePath, "utf8");
  const records = csvParser(fileContents, {
    columns: true,
    skip_empty_lines: true,
  });

  const filtered = records.filter((row) => {
    const rowDate = new Date(row.date);
    rowDate.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return rowDate >= start && rowDate <= end;
  });

  // Import each row sequentially
  for (const row of filtered) {
    try {
      await addActualCountService({
        date: row.date,
        actualCount: Number(row.darshans),
        userId: req.user._id
      });
    } catch (err) {
      // Ignore if it already exists to prevent duplication error
    }
  }

  const tomorrowForecast = await getTomorrowForecast(req.user._id);

  return res.status(200).json(
    new ApiResponse(200, {
      imported: filtered.length,
      nextForecast: tomorrowForecast
    }, "CSV history imported successfully and rolling forecast updated")
  );
});

// GET /api/v1/forecast/admin/summary
export const getAdminForecastSummary = asyncHandler(async (req, res) => {
  const [latestForecast, latestActual, summary, recentActivity] = await Promise.all([
    ForecastRecord.findOne({}).sort({ date: -1 }).lean(),
    ActualPilgrimCount.findOne({}).sort({ date: -1 }).lean(),
    ForecastRecord.aggregate([
      {
        $group: {
          _id: null,
          totalForecasts: { $sum: 1 },
          completedForecasts: {
            $sum: {
              $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0]
            }
          },
          averageMape: { $avg: "$mape" },
        },
      },
    ]),
    ForecastRecord.find({})
      .sort({ updatedAt: -1 })
      .limit(10)
      .lean(),
  ]);

  const totalPilgrims = await ActualPilgrimCount.aggregate([
    { $group: { _id: null, total: { $sum: "$count" } } },
  ]);

  const totalStaff = await User.countDocuments({
    role: { $in: ["SECURITY_HEAD", "CHEF_MANAGER", "MEDICAL_MANAGER"] },
    status: "ACTIVE",
  });

  return res.status(200).json(
    new ApiResponse(200, {
      latestForecast,
      latestActual,
      summary: summary[0] || {
        totalForecasts: 0,
        completedForecasts: 0,
        averageMape: 0,
      },
      totalPilgrims: totalPilgrims[0]?.total || 0,
      totalStaff,
      recentActivity,
    })
  );
});

// POST /api/v1/forecast/simulation
export const updateSimulationConfig = asyncHandler(async (req, res) => {
  const { simulationMode, simulatedDate } = req.body;
  const config = setSimulationConfig({ enabled: simulationMode, date: simulatedDate });
  return res.status(200).json(
    new ApiResponse(200, config, "Simulation configuration updated successfully")
  );
});

// GET /api/v1/forecast/simulation
export const getSimulationConfig = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        simulationMode: isSimulationModeEnabled(),
        simulatedDate: getSimulatedDate().toISOString().split("T")[0]
      },
      "Simulation configuration fetched successfully"
    )
  );
});
