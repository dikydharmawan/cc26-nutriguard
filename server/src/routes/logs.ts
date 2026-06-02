import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import * as logController from "../controllers/logController";

const router = Router();

router.get("/", authenticate, logController.getLogs);
router.get("/:id", authenticate, logController.getLogById);
router.delete("/:id", authenticate, logController.deleteLogById);

export default router;
