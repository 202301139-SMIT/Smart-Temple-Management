import { User } from "../models/user.model.js";

const STAFF_ROLES = ["SECURITY_HEAD", "CHEF_MANAGER", "MEDICAL_MANAGER"];

export const createStaffService = async ({ name, email, password, role }) => {
  if (!STAFF_ROLES.includes(role)) {
    throw new Error(`Invalid role. Valid staff roles are: ${STAFF_ROLES.join(", ")}`);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("A user with this email already exists.");
  }

  const staff = await User.create({
    name,
    email,
    password,
    role,
    status: "ACTIVE" // Set to ACTIVE so staff can log in immediately upon creation
  });

  const createdStaff = await User.findById(staff._id).select("-password").lean();
  return createdStaff;
};

export const listStaffService = async () => {
  return User.find({ role: { $in: STAFF_ROLES } })
    .select("name email role status createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();
};

export const suspendStaffService = async (userId) => {
  const staff = await User.findById(userId);
  if (!staff) {
    throw new Error("Staff user not found.");
  }

  staff.status = "SUSPENDED";
  await staff.save();

  return User.findById(userId).select("-password").lean();
};

export const activateStaffService = async (userId) => {
  const staff = await User.findById(userId);
  if (!staff) {
    throw new Error("Staff user not found.");
  }

  staff.status = "ACTIVE";
  await staff.save();

  return User.findById(userId).select("-password").lean();
};

export const viewStaffService = async (userId) => {
  const staff = await User.findById(userId).select("-password").lean();
  if (!staff) {
    throw new Error("Staff user not found.");
  }
  return staff;
};

export const listUsersService = async () => {
  return User.find({})
    .select("name email role status createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();
};
