import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "TTD_ADMIN",

        "SECURITY_HEAD",
        "CHEF_MANAGER",
        "MEDICAL_MANAGER",

        "PILGRIM",

        "HOTEL_PARTNER",
        "TRAVEL_PARTNER",
      ],
      default: "PILGRIM",
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "ACTIVE",
        "REJECTED",
        "SUSPENDED",
      ],
      default: "PENDING",
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};



export const User = mongoose.model("User", userSchema);