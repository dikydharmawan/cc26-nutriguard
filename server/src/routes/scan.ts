import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middlewares/authenticate";
import { handleScan } from "../controllers/scanController";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

// Accept either a multipart file field named "image" OR a JSON body with imageUrl
router.post("/", authenticate, upload.single("image"), handleScan);

export default router;
