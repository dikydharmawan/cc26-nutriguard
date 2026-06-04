import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler";
import { makePredictor } from "./ml/predictor";
import { router } from "./routes/index";
import { env } from "./config/env";

const app = express();
app.use(cors());
app.use(express.json());

makePredictor(env.USE_STUB_PREDICTOR, env.TF_MODEL_PATH).then((predictor) => {
  app.locals.predictor = predictor;
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", router);
app.use(errorHandler);

export default app;
