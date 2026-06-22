import { Router } from "express";

import {
  registerPilgrim,login,getCurrentUser,logout
} from "../controllers/auth.controller.js";

import {
  validate,
} from "../middleware/validate.js";

import {
  registerPilgrimSchema,loginSchema,
} from "../validations/auth.validation.js";

import {verifyJWT} from "../middleware/auth.middleware.js";


const router = Router();

router.post(
  "/register-pilgrim",
  validate(registerPilgrimSchema),
  registerPilgrim
);

router.post(
  "/login",
  validate(loginSchema),
  login
);

router.post(
  "/logout",
  verifyJWT,
  logout
);

//protected route for login


router.get(
  "/profile",
  verifyJWT,
  getCurrentUser
);

export default router;