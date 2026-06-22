import { z } from "zod";

export const createStaffSchema = z.object({
  name: z.string().min(2),
  email: z.email().toLowerCase(),
  role: z.enum(["SECURITY_HEAD", "CHEF_MANAGER", "MEDICAL_MANAGER"]),
  temporaryPassword: z.string().min(8),
});

export const updateUserStatusSchema = z.object({
  userId: z.string().min(1),
  status: z.enum(["ACTIVE", "SUSPENDED", "REJECTED"]),
});
