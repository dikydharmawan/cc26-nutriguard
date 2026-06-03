export interface Prediction {
  detected: DetectedItem[];
  nutrition: NormalizedNutrition;
  confidence: number;
  modelVersion: string;
}

export interface DetectedItem {
  label: string;
  confidence: number;
  boundingBox?: { x: number; y: number; w: number; h: number };
}

export interface NormalizedNutrition {
  servingSize: string;
  calories: number;
  totalFat: number; // grams
  saturatedFat: number;
  transFat: number;
  cholesterol: number; // mg
  sodium: number; // mg
  totalCarbs: number;
  dietaryFiber: number;
  totalSugars: number;
  protein: number;
  vitamins: Record<string, number>; // { "vitaminD": 2, "calcium": 260 }
}

export interface Predictor {
  predict(imageBuffer: Buffer): Promise<Prediction>;
}

// repository plain-object types
export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface FoodLogRecord {
  id: string;
  userId: string;
  imageUrl: string | null;
  detected: Prediction["detected"];
  nutrition: NormalizedNutrition;
  confidence: number;
  modelVersion: string;
  createdAt: Date;
}
