import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import * as logController from "../controllers/logController";

const router = Router();

/**
 * @openapi
 * /logs:
 *   get:
 *     tags: [Logs]
 *     summary: Paginated scan history
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: pageSize
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: Paginated log list
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, logController.getLogs);

/**
 * @openapi
 * /logs/{id}:
 *   get:
 *     tags: [Logs]
 *     summary: Get a single food log by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Food log
 *       404:
 *         description: Log not found
 *       401:
 *         description: Unauthorized
 *   delete:
 *     tags: [Logs]
 *     summary: Delete a food log
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       204:
 *         description: Deleted
 *       404:
 *         description: Log not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authenticate, logController.getLogById);
router.delete("/:id", authenticate, logController.deleteLogById);

export default router;
