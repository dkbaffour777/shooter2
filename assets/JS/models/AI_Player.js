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
  draw() {
    drawPlayerHead(this.x_body + playerWidth / 4, this.y_head, this.color);
    drawPlayerBody(this.x_body, this.y_body, this.color);
    this.sensor.draw();
  }
}
