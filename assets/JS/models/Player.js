import {
  playerWidth,
  drawPlayerBody,
  drawPlayerHead,
  playerHeight,
} from "../utils.js";

export class Player {
  constructor(y_head, x_body, y_body, color) {
    this.y_head = y_head;
    this.x_body = x_body;
    this.y_body = y_body;
    this.color = color;

    this.height = playerHeight;
    this.width = playerWidth;
  }

  #bullets = [];
  #isMotion = true;

  stopMotion() {
    this.#isMotion = false;
  }
  startMotion() {
    this.#isMotion = true;
  }
  motion() {
    return this.#isMotion;
  }
  addBullet(bullet) {
    this.#bullets.push(bullet);
  }
  removeBullet(id) {
    this.#bullets = this.#bullets.filter((bullet) => bullet.id !== id);
  }
  emptyBullets() {
    this.#bullets = [];
  }
  getBullets() {
    return this.#bullets;
  }
  draw() {
    drawPlayerHead(this.x_body + playerWidth / 4, this.y_head, this.color);
    drawPlayerBody(this.x_body, this.y_body, this.color);
  }
}
