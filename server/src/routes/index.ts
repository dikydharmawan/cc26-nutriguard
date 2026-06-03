import { Router } from "express";
import authRoutes from "./auth";
import scanRoutes from "./scan";
import logRoutes from "./logs";

export const router = Router();

router.use("/auth", authRoutes);
router.use("/scan", scanRoutes);
router.use("/logs", logRoutes);
