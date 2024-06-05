import {
  createCorrelationHeatmap,
  createHistograms,
} from "./bulletDataAnalysis.js";
import { evaluateModel } from "./evaluateModel.js";

import { trainModel } from "./trainModel.js";
import { navigationEventListeners } from "./utils.js";

let trainedModel;
trainModel().then(({ model, features, labels, history }) => {
  trainedModel = model;

  // Evaluate the model
  evaluateModel(model, features, labels, history);

  // Provide bullet data analysis
  createCorrelationHeatmap();
  createHistograms();

  // Screen navigation event listeners
  // This is where the game is started
  navigationEventListeners();
});

export async function predictBulletHit(bulletFeatures) {
  const features = [
    [
      bulletFeatures.bullet_x,
      bulletFeatures.bullet_y,
      bulletFeatures.bullet_spd,
      bulletFeatures.ai_x,
      bulletFeatures.ai_y_head,
      bulletFeatures.ai_y_body,
      bulletFeatures.ai_direction,
    ],
  ];

  const input = tf.tensor2d(features);
  const prediction = trainedModel.predict(input);
  const result = await prediction.data();
  return result[0] > 0.5;
}
