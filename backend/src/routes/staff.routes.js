import { Router } from "express";
import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import {
  createStaff,
  listStaff,
  listUsers,
  suspendStaff,
  activateStaff,
  viewStaff,
  updateUserStatus,
  getDashboardStatistics
} from "../controllers/staff.controller.js";
import { createStaffSchema, updateUserStatusSchema } from "../validations/staff.validation.js";

const router = Router();

const ADMIN_ROLES = ["SUPER_ADMIN", "TTD_ADMIN"];

router.use(verifyJWT);
router.use(authorizeRoles(ADMIN_ROLES));

// Create staff
router.post("/create", validate(createStaffSchema), createStaff);

// List staff
router.get("/list", listStaff);

// List all users
router.get("/users", listUsers);

// Dashboard Statistics
router.get("/statistics", getDashboardStatistics);

// View specific staff
router.get("/:id", viewStaff);

// Suspend staff
router.patch("/:id/suspend", suspendStaff);

// Activate staff
router.patch("/:id/activate", activateStaff);

// General status update (backward compatibility)
router.patch("/status", validate(updateUserStatusSchema), updateUserStatus);

export default router;
