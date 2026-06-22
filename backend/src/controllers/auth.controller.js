import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";

export const registerPilgrim = asyncHandler(
  async (req, res) => {
    const {
      name,
      email,
      password,
    } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "User already exists with this email"
      );
    }

    const user = await User.create({
      name,
      email,
      password,

      role: "PILGRIM",

      status: "ACTIVE",
    });

    const createdUser = await User.findById(
      user._id
    ).select("-password");

    if (!createdUser) {
      throw new ApiError(
        500,
        "Failed to create user"
      );
    }

    return res.status(201).json(
      new ApiResponse(
        201,
        createdUser,
        "Pilgrim registered successfully"
      )
    );
  }
);

// login 

export const login = asyncHandler(async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid credentials");
    }

    if (user.status !== "ACTIVE") {
        throw new ApiError(403, "Account is not active");
    }

    const accessToken = jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false
        })
        .json(
            new ApiResponse(
                200,
                {
                    user,
                    accessToken
                },
                "Login successful"
            )
        );
});

// get profile

export const getCurrentUser = asyncHandler(
  async (req, res) => {
    return res.status(200).json(
      new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
      )
    );
  }
);

// logout

export const logout = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
    })
    .json(new ApiResponse(200, {}, "Logout successful"));
});