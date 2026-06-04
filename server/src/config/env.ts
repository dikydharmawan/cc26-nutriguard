import { cleanEnv, str, num, bool } from "envalid";

export const env = cleanEnv(process.env, {
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  JWT_ACCESS_TTL: str({ default: "15m" }),
  JWT_REFRESH_TTL: str({ default: "7d" }),
  PORT: num({ default: 3000 }),
  USE_STUB_PREDICTOR: bool({ default: true }), // true = stub, false = real TF model
  TF_MODEL_PATH: str({ default: "ml/model" }), // path to SavedModel dir
  // Optional S3
  AWS_BUCKET: str({ default: "" }),
  AWS_REGION: str({ default: "us-east-1" }),
});
