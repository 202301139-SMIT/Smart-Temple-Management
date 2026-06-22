import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  addActualCountService,
  updateActualCountService,
  getActualRecordsService
} from "../services/actuals.service.js";

// POST /api/v1/actuals/add
export const addActualCount = asyncHandler(async (req, res) => {
  const { date, actualCount } = req.body;
  if (!date || actualCount === undefined) {
    throw new ApiError(400, "date and actualCount are required");
  }

  try {
    const result = await addActualCountService({
      date,
      actualCount: Number(actualCount),
      userId: req.user._id
    });

    return res.status(201).json(
      new ApiResponse(201, result, "Actual pilgrim count added successfully")
    );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// PATCH /api/v1/actuals/update
export const updateActualCount = asyncHandler(async (req, res) => {
  const { date, actualCount } = req.body;
  if (!date || actualCount === undefined) {
    throw new ApiError(400, "date and actualCount are required");
  }

  try {
    const result = await updateActualCountService({
      date,
      actualCount: Number(actualCount),
      userId: req.user._id
    });

    return res.status(200).json(
      new ApiResponse(200, result, "Actual pilgrim count updated successfully")
    );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// GET /api/v1/actuals/records
export const getActualRecords = asyncHandler(async (req, res) => {
  const records = await getActualRecordsService();
  return res.status(200).json(
    new ApiResponse(200, { records }, "Actual pilgrim counts retrieved successfully")
  );
});
