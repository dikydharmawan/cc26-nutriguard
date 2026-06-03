import { Predictor, Prediction } from "../types";

// this is just sample shape that FoodLog.detected and FoodLog.nutrition will store.
const SAMPLE_PREDICTION: Prediction = {
  modelVersion: "stub-v0.1",
  confidence: 0.91,
  detected: [
    {
      label: "NutritionFactsTable",
      confidence: 0.95,
      boundingBox: { x: 42, y: 18, w: 320, h: 480 },
    },
    {
      label: "ServingSize",
      confidence: 0.88,
      boundingBox: { x: 55, y: 32, w: 240, h: 28 },
    },
  ],
  nutrition: {
    servingSize: "240 mL (1 cup)",
    calories: 150,
    totalFat: 8,
    saturatedFat: 1.5,
    transFat: 0,
    cholesterol: 0,
    sodium: 160,
    totalCarbs: 17,
    dietaryFiber: 2,
    totalSugars: 12,
    protein: 3,
    vitamins: {
      vitaminD: 2,
      calcium: 260,
      iron: 8,
      potassium: 235,
    },
  },
};

// stub predictor: ignores buffer, returns deterministic data immediately.
export const stubPredictor: Predictor = {
  predict: async (_imageBuffer: Buffer): Promise<Prediction> =>
    structuredClone(SAMPLE_PREDICTION),
};
