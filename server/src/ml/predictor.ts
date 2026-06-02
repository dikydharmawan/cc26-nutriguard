import { Predictor } from "../types";

export const makePredictor = async (
  useStub: boolean,
  modelPath: string,
): Promise<Predictor> => {
  if (useStub) {
    console.log(
      "[ML] Using STUB predictor — set USE_STUB_PREDICTOR=false to load real model",
    );
    const { stubPredictor } = await import("./stubPredictor");
    return stubPredictor;
  }

  // TODO: idk if this the right way to do it but anyway. will be implemented soon by AI team probably...
  //
  // import * as tf from "@tensorflow/tfjs-node";
  //
  // const model = await tf.loadGraphModel(`file://${path.resolve(modelPath)}/model.json`);
  // // OR for SavedModel: tf.node.loadSavedModel(path.resolve(modelPath));
  //
  // return {
  //   predict: async (imageBuffer: Buffer): Promise<Prediction> => {
  //     // decode image to tensor
  //     const imageTensor = tf.node.decodeImage(imageBuffer, 3) as tf.Tensor3D;
  //
  //     // resize + normalize to model's expected input shape, e.g. [1, 640, 640, 3]
  //     const input = tf.tidy(() =>
  //       imageTensor
  //         .resizeBilinear([640, 640])
  //         .expandDims(0)
  //         .div(255.0)
  //     );
  //
  //     // 3. Execute inference
  //     const output = model.predict(input) as tf.Tensor;
  //     const rawData = await output.array();
  //
  //     // 4. Post-process rawData → Prediction shape
  //     //    (decode bounding boxes, class labels, nutrition fields)
  //     //    This step is highly model-specific — implement parseModelOutput().
  //     const prediction = parseModelOutput(rawData);
  //
  //     // 5. Clean up tensors
  //     tf.dispose([imageTensor, input, output]);
  //
  //     return prediction;
  //   },
  // };

  throw new Error(
    "Real TF predictor not yet wired. Set USE_STUB_PREDICTOR=true or implement the block above.",
  );
};
