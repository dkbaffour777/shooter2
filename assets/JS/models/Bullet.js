import { ctx } from "../canvas.js";

export let bulletRadius = 10;

export class Bullet {
  constructor(x, y, spd, color) {
    this.x = x;
    this.y = y;
    this.radius = bulletRadius;
    this.spd = spd;
    this.color = color;
    this.hit = null; // To track hit or miss
    this.features = {}; // To store features
  }

  updateFeatures(aiPlayer) {
    this.features = {
      bullet_x: this.x,
      bullet_y: this.y,
      bullet_spd: this.spd,
      ai_x: aiPlayer.x_body,
      ai_y_head: aiPlayer.y_head,
      ai_y_body: aiPlayer.y_body,
      ai_direction: aiPlayer.getDirection(),
    };
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
