import { playerWidth, drawPlayerBody, drawPlayerHead } from "../utils.js";
import { Player } from "./Player.js";
import { Sensor } from "./Sensor.js";

export class AI_Player extends Player {
  constructor(y_head, x_body, y_body, color) {
    super(y_head, x_body, y_body, color);
    this.sensor = new Sensor(this);
    this.collectedData = [];
  }

  #direction = 1;
  #lives = 15;
  #hits = 0;

  getDirection() {
    if (!this.motion()) {
      this.#direction = 0;
    } else if (this.#direction === 0 && this.motion()) this.#direction = 1;

    return this.#direction;
  }

  changeDirection() {
    if (this.#direction === 1) this.#direction = -1;
    else if (this.#direction === -1) this.#direction = 1;
  }

  looseLive() {
    this.#lives -= 1;
  }

  getLives() {
    return this.#lives;
  }

  addHit() {
    this.#hits += 1;
  }

  getHits() {
    return this.#hits;
  }

  updateBulletHitStatus(bullet, hit) {
    bullet.hit = hit;
    bullet.updateFeatures(this);
    this.collectedData.push({
      features: bullet.features,
      hit: bullet.hit ? 1 : 0,
    });
  }

  saveCollectedData() {
    const json = JSON.stringify(this.collectedData);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bullet_data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  draw() {
    drawPlayerHead(this.x_body + playerWidth / 4, this.y_head, this.color);
    drawPlayerBody(this.x_body, this.y_body, this.color);
    this.sensor.draw();
  }
}
