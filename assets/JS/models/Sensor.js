import { ctx } from "../canvas.js";
import { predictBulletHit } from "../index.js";
import { circleTriangleIntersection } from "../utils.js";

export class Sensor {
  constructor(player) {
    this.player = player;
    this.baseRadius = 100;
    this.height = 90;
  }

  #isHumanPayerBulletDetected = false;

  async detectHumanPlayerBullet(hp_bullet, isHit, game) {
    this.#isHumanPayerBulletDetected = circleTriangleIntersection(
      hp_bullet,
      this
    );
    if (this.#isHumanPayerBulletDetected) {
      // Human player bullet has been detected
      hp_bullet.updateFeatures(this.player);

      let willHit = await predictBulletHit(hp_bullet.features);
      if (willHit) {
        // Predict will hit
        document.querySelector("#aimsg").innerHTML =
          "Will hit, change direction!";
        document.querySelector("#aimsg").style.color = "Red";
        this.player.changeDirection();
      } else {
        // Predict will miss
        document.querySelector("#aimsg").innerHTML = "Will Miss!";
        document.querySelector("#aimsg").style.color = "rgb(16, 218, 33)";
      }

      let hit = isHit();

      // Check if it actually hit ie when the prediction fails
      if (hit) {
        // Update hit count
        this.player.addHit();
        document.querySelector("#hits").innerHTML = `${this.player.getHits()}`;

        // Update AI player lives
        this.player.looseLive();
        document.querySelector(
          "#lives"
        ).innerHTML = `${this.player.getLives()}`;
        if (this.player.getLives() === 0) {
          game.end(this.player, "You won!", false);
        }
      }
      this.player.updateBulletHitStatus(hp_bullet, hit);
    }
  }

  draw() {
    let apexX = this.player.x_body + this.player.width / 2;
    let apexY = this.player.y_head;
    ctx.beginPath();
    ctx.moveTo(apexX, apexY);
    ctx.lineTo(apexX + this.baseRadius, apexY + this.height);
    ctx.lineTo(apexX - this.baseRadius, apexY + this.height);
    ctx.closePath();
    ctx.fillStyle = this.#isHumanPayerBulletDetected
      ? "rgba(0,0,255,0.25)"
      : "rgba(255,0,0,0.25)";
    ctx.fill();
  }
}
