// Function to fetch and preprocess data
async function fetchBulletData() {
  const response = await fetch("assets/data/bullet_data.json");
  const data = await response.json();
  return data;
}

// Function to validate and preprocess data
function preprocessData(data) {
  return data
    .filter((d) => d.features && d.hit !== undefined)
    .map((d) => ({
      bullet_x: d.features.bullet_x,
      bullet_y: d.features.bullet_y,
      bullet_spd: d.features.bullet_spd,
      ai_x: d.features.ai_x,
      ai_y_head: d.features.ai_y_head,
      ai_y_body: d.features.ai_y_body,
      ai_direction: d.features.ai_direction,
      hit: d.hit,
    }));
}

// Function to create histograms for bullet_x and ai_x based on hit/miss
async function createHistograms() {
  const rawData = await fetchBulletData();
  const data = preprocessData(rawData);

  const hits = data.filter((d) => d.hit === 1);
  const misses = data.filter((d) => d.hit === 0);

  const traces = [
    {
      x: hits.map((d) => d.bullet_x),
      type: "histogram",
      name: "bullet_x (hit)",
      marker: { color: "red" },
      opacity: 0.75,
    },
    {
      x: misses.map((d) => d.bullet_x),
      type: "histogram",
      name: "bullet_x (miss)",
      marker: { color: "blue" },
      opacity: 0.75,
    },
    {
      x: hits.map((d) => d.ai_x),
      type: "histogram",
      name: "ai_x (hit)",
      marker: { color: "red" },
      opacity: 0.75,
    },
    {
      x: misses.map((d) => d.ai_x),
      type: "histogram",
      name: "ai_x (miss)",
      marker: { color: "blue" },
      opacity: 0.75,
    },
  ];

  const layout = {
    barmode: "overlay",
    title: "Distribution of bullet_x and ai_x Based on Hit/Miss",
  };

  Plotly.newPlot("histograms", traces, layout);
}

// Function to create a heatmap of correlations
async function createCorrelationHeatmap() {
  const rawData = await fetchBulletData();
  const data = preprocessData(rawData);

  const features = data.map((d) => [
    d.bullet_x,
    d.bullet_y,
    d.bullet_spd,
    d.ai_x,
    d.ai_y_head,
    d.ai_y_body,
    d.ai_direction,
    d.hit,
  ]);

  const colNames = [
    "bullet_x",
    "bullet_y",
    "bullet_spd",
    "ai_x",
    "ai_y_head",
    "ai_y_body",
    "ai_direction",
    "hit",
  ];

  const corrMatrix = [];
  for (let i = 0; i < colNames.length; i++) {
    const row = [];
    for (let j = 0; j < colNames.length; j++) {
      const xi = features.map((r) => r[i]);
      const xj = features.map((r) => r[j]);
      const correlation = tf.metrics
        .mse(tf.tensor1d(xi), tf.tensor1d(xj))
        .dataSync()[0];
      row.push(correlation);
    }
    corrMatrix.push(row);
  }

  const dataForHeatmap = [
    {
      z: corrMatrix,
      x: colNames,
      y: colNames,
      type: "heatmap",
      colorscale: "Viridis",
    },
  ];

  const layout = {
    title: "Correlation Heatmap",
    xaxis: { title: "Features" },
    yaxis: { title: "Features" },
  };

  Plotly.newPlot("correlation-heatmap", dataForHeatmap, layout);
}

// Export the functions for use in other files
export { createHistograms, createCorrelationHeatmap };
