import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createStaffService,
  listStaffService,
  suspendStaffService,
  activateStaffService,
  viewStaffService,
  listUsersService
} from "../services/staff.service.js";
import { ForecastRecord } from "../models/forecastRecord.model.js";
import { ActualPilgrimCount } from "../models/actualPilgrimCount.model.js";
import { User } from "../models/user.model.js";

// POST /api/v1/staff/create
export const createStaff = asyncHandler(async (req, res) => {
  const { name, email, role, temporaryPassword } = req.body;

  try {
    const user = await createStaffService({
      name,
      email,
      password: temporaryPassword || "Staff@123",
      role
    });

    return res.status(201).json(
      new ApiResponse(201, { user }, "Staff account created successfully")
    );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// GET /api/v1/staff/list
export const listStaff = asyncHandler(async (req, res) => {
  const staff = await listStaffService();
  return res.status(200).json(
    new ApiResponse(200, { staff }, "Staff list retrieved successfully")
  );
});

// GET /api/v1/staff/users
export const listUsers = asyncHandler(async (req, res) => {
  const users = await listUsersService();
  return res.status(200).json(
    new ApiResponse(200, { users }, "User list retrieved successfully")
  );
});

// PATCH /api/v1/staff/:id/suspend
export const suspendStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await suspendStaffService(id);
    return res.status(200).json(
      new ApiResponse(200, { user }, "Staff account suspended successfully")
    );
  } catch (error) {
    throw new ApiError(404, error.message);
  }
});

// PATCH /api/v1/staff/:id/activate
export const activateStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await activateStaffService(id);
    return res.status(200).json(
      new ApiResponse(200, { user }, "Staff account activated successfully")
    );
  } catch (error) {
    throw new ApiError(404, error.message);
  }
});

// GET /api/v1/staff/:id
export const viewStaff = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const user = await viewStaffService(id);
    return res.status(200).json(
      new ApiResponse(200, { user }, "Staff details retrieved successfully")
    );
  } catch (error) {
    throw new ApiError(404, error.message);
  }
});

// PATCH /api/v1/staff/status (backward compatibility)
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { userId, status } = req.body;
  if (!userId || !status) {
    throw new ApiError(400, "userId and status are required");
  }

  try {
    let user;
    if (status === "ACTIVE") {
      user = await activateStaffService(userId);
    } else if (status === "SUSPENDED") {
      user = await suspendStaffService(userId);
    } else {
      // General update
      const existing = await User.findById(userId);
      if (!existing) throw new Error("User not found");
      existing.status = status;
      await existing.save();
      user = await User.findById(userId).select("-password").lean();
    }

    return res.status(200).json(
      new ApiResponse(200, { user }, "User status updated successfully")
    );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// GET /api/v1/staff/list (backward compatibility)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await listUsersService();
  return res.status(200).json(new ApiResponse(200, { users }));
});

// GET /api/v1/staff/statistics (Dashboard Statistics)
export const getDashboardStatistics = asyncHandler(async (req, res) => {
  const [totalStaff, activeStaff, suspendedStaff, totalPilgrims, completedForecasts] = await Promise.all([
    User.countDocuments({ role: { $in: ["SECURITY_HEAD", "CHEF_MANAGER", "MEDICAL_MANAGER"] } }),
    User.countDocuments({ role: { $in: ["SECURITY_HEAD", "CHEF_MANAGER", "MEDICAL_MANAGER"] }, status: "ACTIVE" }),
    User.countDocuments({ role: { $in: ["SECURITY_HEAD", "CHEF_MANAGER", "MEDICAL_MANAGER"] }, status: "SUSPENDED" }),
    ActualPilgrimCount.aggregate([
      { $group: { _id: null, total: { $sum: "$count" } } }
    ]),
    ForecastRecord.countDocuments({ status: "COMPLETED" })
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      totalStaff,
      activeStaff,
      suspendedStaff,
      totalPilgrims: totalPilgrims[0]?.total || 0,
      completedForecasts
    }, "Dashboard statistics retrieved successfully")
  );
});
