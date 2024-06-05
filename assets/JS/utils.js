import { ctx } from "./canvas.js";
import { keyDownHandler, keyUpHandler } from "./playerControls.js";

const drawRectangle = (x, y, width, height, color) => {
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};

export let playerHeight = 10;
export let playerWidth = 45;

export function drawPlayerHead(x, y, color) {
  drawRectangle(x, y, playerWidth / 2, playerHeight, color);
}

export function drawPlayerBody(x, y, color) {
  drawRectangle(x, y, playerWidth, playerHeight, color);
}

export function circleTriangleIntersection(bullet, sensor) {
  // Calculate the center coordinates and radius of the bullet circle
  const bulletX = bullet.x;
  const bulletY = bullet.y;
  const bulletRadius = bullet.radius;

  // Get the apex coordinates of the sensor triangle
  const apexX = sensor.player.x_body + sensor.player.width / 2;
  const apexY = sensor.player.y_head;

  // Check if the bullet is within the base radius and height of the sensor triangle
  if (
    bulletX >= apexX - sensor.baseRadius &&
    bulletX <= apexX + sensor.baseRadius &&
    bulletY >= apexY &&
    bulletY <= apexY + sensor.height
  ) {
    return true; // Intersection detected
  }

  // Check if the bullet is within the distance of the apex to any of the base points
  const closestX = clamp(
    bulletX,
    apexX - sensor.baseRadius,
    apexX + sensor.baseRadius
  );
  const closestY = clamp(bulletY, apexY, apexY + sensor.height);
  const distance = Math.sqrt(
    (bulletX - closestX) ** 2 + (bulletY - closestY) ** 2
  );
  if (distance <= bulletRadius) {
    return true; // Intersection detected
  }

  return false; // No intersection detected
}

// Helper function to clamp a value within a range
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function navigationEventListeners() {
  document.querySelector("#open-inst").addEventListener("click", () => {
    document.querySelector("#inst").style.display = "flex";
  });

  document.querySelector("#close-inst").addEventListener("click", () => {
    document.querySelector("#inst").style.display = "none";
  });

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
}
