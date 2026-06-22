import { Router } from "express";
import {
  addActualCount,
  updateActualCount,
  getActualRecords
} from "../controllers/actuals.controller.js";
import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { enterActualSchema } from "../validations/forecast.validation.js";

const router = Router();

const ACTUALS_EDIT_ROLES = [
  "SUPER_ADMIN",
  "TTD_ADMIN",
  "SECURITY_HEAD",
  "CHEF_MANAGER",
  "MEDICAL_MANAGER"
];

// Add Actual count
router.post(
  "/add",
  verifyJWT,
  authorizeRoles(ACTUALS_EDIT_ROLES),
  validate(enterActualSchema),
  addActualCount
);

// Update Actual count
router.patch(
  "/update",
  verifyJWT,
  authorizeRoles(ACTUALS_EDIT_ROLES),
  validate(enterActualSchema),
  updateActualCount
);

// View Actual records
router.get(
  "/records",
  verifyJWT,
  authorizeRoles(ACTUALS_EDIT_ROLES),
  getActualRecords
);

export default router;
