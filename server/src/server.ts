import "dotenv/config";
import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import yaml from "yaml";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { makePredictor } from "./ml/predictor";
import { router } from "./routes/index";

async function bootstrap() {
  // load ml predictor (stub or real) — injected into routes via app.locals
  const predictor = await makePredictor(
    env.USE_STUB_PREDICTOR,
    env.TF_MODEL_PATH,
  );

  const app = express();
  app.use(cors());
  app.use(express.json());

  // attach predictor so controllers can receive it via dependency injection
  app.locals.predictor = predictor;

  // swagger at /api/docs
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // routes
  app.use("/api", router);

  // global error handler (must be last)
  app.use(errorHandler);

  app.listen(env.PORT, () =>
    console.log(
      `NutriGuard API running on port ${env.PORT} [stub=${env.USE_STUB_PREDICTOR}]`,
    ),
  );
}

bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
