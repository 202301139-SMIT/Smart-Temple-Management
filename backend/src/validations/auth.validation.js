import { z } from "zod";

const registerPilgrimSchema = z
  .object({
    name: z.string().min(2),

    email: z.email(),

    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[!@#$%^&*(),.?":{}|<>]/),

    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

// login schema

const loginSchema = z.object({
  email: z
    .email("Invalid email address")
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Password is required"),
});

// hotel ragistration

 const registerHotelSchema = z.object({
  name: z
    .string()
    .min(2),

  email: z
    .email()
    .toLowerCase(),

  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[!@#$%^&*(),.?":{}|<>]/),

  hotelName: z
    .string()
    .min(3),

  ownerName: z
    .string()
    .min(2),

  registrationNumber: z
    .string()
    .min(3),

  phone: z
    .string()
    .min(10)
    .max(15),

  totalRooms: z
    .number()
    .positive(),
});

// travel ragistrastion

const registerTravelSchema = z.object({
  name: z
    .string()
    .min(2),

  email: z
    .email()
    .toLowerCase(),

  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[!@#$%^&*(),.?":{}|<>]/),

  agencyName: z
    .string()
    .min(3),

  licenseNumber: z
    .string()
    .min(3),

  phone: z
    .string()
    .min(10)
    .max(15),

  vehicleCount: z
    .number()
    .positive(),
});


  export
  {
    registerPilgrimSchema,
    loginSchema,
    registerHotelSchema,
    registerTravelSchema,
};