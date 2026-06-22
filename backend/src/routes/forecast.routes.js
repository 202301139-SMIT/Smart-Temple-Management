import { Router } from "express";
import {
  getTomorrowPrediction,
  getNext7DayForecast,
  getForecastHistory,
  getForecastMetrics,
  enterActualCount,
  getAdminForecastSummary,
  importActual,
  importActualHistory,
  importCsvHistory,
  getSimulationConfig,
  updateSimulationConfig
} from "../controllers/forecast.controller.js";
import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  enterActualSchema,
  importHistorySchema,
  importCsvHistorySchema,
} from "../validations/forecast.validation.js";

const router = Router();

const VIEW_FORECAST_ROLES = [
  "SUPER_ADMIN",
  "TTD_ADMIN",
  "SECURITY_HEAD",
  "CHEF_MANAGER",
  "MEDICAL_MANAGER",
  "PILGRIM",
  "HOTEL_PARTNER",
  "TRAVEL_PARTNER"
];

const ADMIN_ROLES = ["SUPER_ADMIN", "TTD_ADMIN"];

// View predictions
router.get("/tomorrow", verifyJWT, authorizeRoles(VIEW_FORECAST_ROLES), getTomorrowPrediction);
router.get("/next-7-days", verifyJWT, authorizeRoles(VIEW_FORECAST_ROLES), getNext7DayForecast);
router.get("/history", verifyJWT, authorizeRoles(VIEW_FORECAST_ROLES), getForecastHistory);
router.get("/metrics", verifyJWT, authorizeRoles(VIEW_FORECAST_ROLES), getForecastMetrics);

// Simulation Configuration (Admin only)
router.get("/simulation", verifyJWT, authorizeRoles(ADMIN_ROLES), getSimulationConfig);
router.post("/simulation", verifyJWT, authorizeRoles(ADMIN_ROLES), updateSimulationConfig);

// Legacy and import actions (Admin only)
router.post(
  "/actual",
  verifyJWT,
  authorizeRoles(ADMIN_ROLES),
  validate(enterActualSchema),
  enterActualCount
);

router.post(
  "/import",
  verifyJWT,
  authorizeRoles(ADMIN_ROLES),
  validate(enterActualSchema),
  importActual
);

router.post(
  "/import-history",
  verifyJWT,
  authorizeRoles(ADMIN_ROLES),
  validate(importHistorySchema),
  importActualHistory
);

router.post(
  "/import-csv",
  verifyJWT,
  authorizeRoles(ADMIN_ROLES),
  validate(importCsvHistorySchema),
  importCsvHistory
);

router.get(
  "/admin/summary",
  verifyJWT,
  authorizeRoles(ADMIN_ROLES),
  getAdminForecastSummary
);

export default router;
