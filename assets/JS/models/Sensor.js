import { ctx } from "../canvas.js";
import { circleTriangleIntersection } from "../utils.js";

export class Sensor {
  constructor(player) {
    this.player = player;
    this.baseRadius = 100;
    this.height = 90;
  }

  #isHumanPayerBulletDetected = false;

  detectHumanPlayerBullet(hp_bullet, isHit, game) {
    this.#isHumanPayerBulletDetected = circleTriangleIntersection(
      hp_bullet,
      this
    );
    if (this.#isHumanPayerBulletDetected) {
      // Update the bullet feature information with 'this' player (AI player)
      hp_bullet.updateFeatures(this.player);

      let hit = isHit();

      // Check if the bullet actually hits
      if (hit) {
        // Update AI player lives
        this.player.looseLive();
        if (this.player.getLives() === 0) {
          game.end(this.player, "You won!", true);
        }
      }

      // Update the bullet hit status of the player (AI player)
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
