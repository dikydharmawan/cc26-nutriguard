import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middlewares/authenticate";
import { handleScan } from "../controllers/scanController";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

/**
 * @openapi
 * /scan:
 *   post:
 *     tags: [Scan]
 *     summary: Upload nutrition label image and receive ML prediction
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl: { type: string, format: uri }
 *     responses:
 *       201:
 *         description: Prediction result and saved log id
 *       400:
 *         description: No image provided
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, upload.single("image"), handleScan);

export default router;
