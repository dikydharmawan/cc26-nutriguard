import { Router } from "express";
import { z } from "zod";
import { validate } from "../middlewares/validate";
import * as authController from "../controllers/authController";

const router = Router();

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

const refreshSchema = z.object({ refreshToken: z.string() });

router.post("/register", validate(credentialsSchema), authController.register);
router.post("/login", validate(credentialsSchema), authController.login);
router.post("/refresh", validate(refreshSchema), authController.refresh);

export default router;
