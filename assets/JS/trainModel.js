// Function to preprocess data
function preprocessData(data) {
  const features = data.map((d) => [
    d.features.bullet_x,
    d.features.bullet_y,
    d.features.bullet_spd,
    d.features.ai_x,
    d.features.ai_y_head,
    d.features.ai_y_body,
    d.features.ai_direction,
  ]);

  const labels = data.map((d) => d.hit);

  //Convert to tensors
  const featureTensor = tf.tensor2d(features);
  const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

  // Normalize features
  const mean = featureTensor.mean(0);
  const std = featureTensor.sub(mean).square().mean(0).sqrt();
  const normalizedFeatures = featureTensor.sub(mean).div(std);

  return { features: normalizedFeatures, labels: labelTensor };
}

// Function to fetch and preprocess data
export async function fetchBulletData() {
  const response = await fetch("assets/data/bullet_data.json");
  const data = await response.json();
  return preprocessData(data);
}

// Export function to train the model
export async function trainModel() {
  // Load and preprocess the data
  const { features, labels } = await fetchBulletData();

  // Define the model architecture
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 128, inputShape: [7], activation: "relu" })
  );
  model.add(tf.layers.dense({ units: 64, activation: "relu" }));
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

  // Compile the model
  model.compile({
    optimizer: "adam",
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });

  // Train the model
  const history = await model.fit(features, labels, {
    epochs: 50,
    batchSize: 32,
    validationSplit: 0.2,
    callbacks: tf.callbacks.earlyStopping({ monitor: "val_loss", patience: 5 }),
  });

  // Accessing validation results
  const validationAccuracy = history.history.val_acc;
  console.log("Validation Accuracy:", validationAccuracy);

  // Model training complete message
  document.querySelector("#ldgm").style.display = "none"; // Hides a loading element
  alert("Model trained!");

  // Return the trained model
  return { model, features, labels, history };
}
