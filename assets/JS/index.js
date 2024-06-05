import { Game } from "./models/Game.js";

import { trainModel } from "./trainModel.js";
import { navigationEventListeners } from "./utils.js";

let trainedModel;
trainModel().then(({ model }) => {
  trainedModel = model;

  // Start game after model is trained
  const game = new Game();
  game.start();

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
