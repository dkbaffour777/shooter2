async function plotConfusionMatrix(model, X_test, Y_test) {
  const predictions = model.predict(X_test).round();
  const yTrue = Y_test.dataSync();
  const yPred = predictions.dataSync();

  const confusionMatrix = tf.math.confusionMatrix(yTrue, yPred, 2);
  const values = await confusionMatrix.array();

  const data = [
    {
      z: values,
      x: ["False", "True"],
      y: ["False", "True"],
      type: "heatmap",
      hoverongaps: false,
    },
  ];

  const layout = {
    title: "Confusion Matrix",
    xaxis: { title: "Predicted Label" },
    yaxis: { title: "True Label" },
  };

  Plotly.newPlot("confusion-matrix", data, layout);
}

// Function to evaluate the model
export async function evaluateModel(model, features, labels, history) {
  const [X_train, X_test, Y_train, Y_test] = tf.tidy(() => {
    const indices = tf.util.createShuffledIndices(features.shape[0]);
    const trainSize = Math.floor(features.shape[0] * 0.8);

    const indicesTensor = tf.tensor1d([...indices], "int32");
    const X_train = features.gather(indicesTensor.slice([0], [trainSize]));
    const X_test = features.gather(indicesTensor.slice([trainSize]));
    const Y_train = labels.gather(indicesTensor.slice([0], [trainSize]));
    const Y_test = labels.gather(indicesTensor.slice([trainSize]));

    return [X_train, X_test, Y_train, Y_test];
  });

  const testResult = model.evaluate(X_test, Y_test);
  const accuracy = testResult[1].dataSync()[0];
  document.querySelector("#test-accuracy").innerHTML = `Test Accuracy: ${(
    accuracy * 100
  ).toFixed(2)}%`;

  // Plot confusion matrix
  await plotConfusionMatrix(model, X_test, Y_test);
}
