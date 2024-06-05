// Canvas
import { canvas, ctx } from "./canvas.js";
// Utils
import { playerHeight, playerWidth } from "./utils.js";
// Models
import { Game } from "./models/Game.js";
import { AI_Player } from "./models/AI_Player.js";
import { Human_Player } from "./models/Human_Player.js";
import { Bullet, bulletRadius } from "./models/Bullet.js";
import { IdGenerator } from "./models/IdGenerator.js";
// Player Controls
import {
  keyDownHandler,
  keyUpHandler,
  mouseMoveHandler,
  leftPressed,
  rightPressed,
} from "./playerControls.js";

// Create the human player object
const human_player = new Human_Player(
  canvas.height - 2 * playerHeight,
  (canvas.width - playerWidth) / 2,
  canvas.height - playerHeight,
  "#0095DD"
);

// Create a new ID generator for the human player bullets
const human_bullet_id = new IdGenerator();

// Create a new ID generator for the human player ammo
const human_ammo_id = new IdGenerator();
let human_ammo_interval = setInterval(() => {
  // Random drop of the player human ammo
  // from the top of the canvas
  // in every 5 seconds
  if (game.getMode() === "play") {
    let x = Math.floor(Math.random() * canvas.width);
    let y = bulletRadius;
    let spd = 1;
    human_player.addAmmo({
      id: human_ammo_id.get(),
      ammo: new Bullet(x, y, spd, "green"),
    });
    human_ammo_id.next();
  }
}, 5000);

// Create the AI player object
const ai_player = new AI_Player(
  playerHeight,
  (canvas.width - playerWidth) / 2,
  0,
  "red"
);

// Create a new ID generator for the AI player's bullets
const ai_bullets_id = new IdGenerator();

let ai_bullet_interval = setInterval(() => {
  if (game.getMode() === "play") {
    let x = ai_player.x_body + playerWidth / 4 + playerWidth / 4;
    let y = 2 * playerHeight + bulletRadius;
    let spd = 20;
    ai_player.addBullet({
      id: ai_bullets_id.get(),
      bullet: new Bullet(x, y, spd, "red"),
    });
    ai_bullets_id.next();
  }
}, 300);

const _players = [human_player, ai_player];
const _intervals = [human_ammo_interval, ai_bullet_interval];
const _msgEle = document.querySelector("#gmsg");
const game = new Game(_players, _intervals, _msgEle);
game.setSpeed(-4);

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  human_player.draw();
  ai_player.draw();

  human_player.getBullets().map(({ id, bullet }) => {
    bullet.draw();

    // Set bullet in motion
    if (game.getMode() === "play") {
      bullet.y -= bullet.spd + game.getSpeed();
    }

    let x_pl_AI = ai_player.x_body + playerWidth / 4;
    function isHit() {
      return (
        bullet.y < ai_player.y_head + 2 * playerHeight + bulletRadius &&
        bullet.x > x_pl_AI &&
        bullet.x < x_pl_AI + playerWidth / 2
      );
    }

    // Detect human player bullet using the AI player's sensor
    ai_player.sensor.detectHumanPlayerBullet(bullet, isHit, game);

    // Remove the bullet from the bullets array when it misses the target
    // For memory management
    if (bullet.y < bulletRadius) {
      human_player.removeBullet(id);
    }
  });

  ai_player.getBullets().map(({ id, bullet }) => {
    bullet.draw();
    let x_pl_human = human_player.x_body + playerWidth / 4;
    // Collosion detection when the human player's bullet hits the head of the AI player
    if (
      bullet.y > human_player.y_head - playerHeight - bulletRadius &&
      bullet.x > x_pl_human &&
      bullet.x < x_pl_human + playerWidth / 2
    ) {
      bullet.y += 0;
      game.end("Game over. Player AI won!");
    } else {
      if (game.getMode() === "play") {
        bullet.y += bullet.spd + game.getSpeed();
      }

      // Remove the bullet from the bullets array when it misses the target
      // For memory management
      if (bullet.y > canvas.height - bulletRadius) {
        ai_player.removeBullet(id);
      }
    }
  });

  human_player.getAmmoPack().map(({ id, ammo }) => {
    ammo.draw();
    let x_pl_human = human_player.x_body + playerWidth / 4;
    // Collosion detection when the human player's ammo hits the head of the AI player
    if (
      ammo.y > human_player.y_head - playerHeight &&
      ammo.x > x_pl_human &&
      ammo.x < x_pl_human + playerWidth / 2
    ) {
      ammo.y += 0;

      human_player.resetBulletCount();
      human_player.removeAmmo(id);
    } else {
      if (game.getMode() === "play") {
        ammo.y += ammo.spd;
      }
      // Remove the ammo from the ammos array when it misses the target
      // For memory management
      if (ammo.y > canvas.height - bulletRadius) {
        human_player.removeAmmo(id);
      }
    }
  });

  // Human Player Motion detection and barriers
  if (human_player.motion()) {
    if (rightPressed && human_player.x_body < canvas.width - playerWidth) {
      human_player.x_body += 7;
    } else if (leftPressed && human_player.x_body > 0) {
      human_player.x_body -= 7;
    }
  }
  // AI Player Motion detection and barriers
  // When the direction of the AI player is 1, it moves right
  // and moves left when it's -1
  if (
    ai_player.getDirection() === 1 &&
    ai_player.x_body < canvas.width - playerWidth
  ) {
    ai_player.x_body += 7 + game.getSpeed();
    if (ai_player.x_body > canvas.width - playerWidth) {
      ai_player.changeDirection();
    }
  } else if (ai_player.getDirection() === -1 && ai_player.x_body > 0) {
    ai_player.x_body -= 7 + game.getSpeed();
    if (ai_player.x_body < 0) {
      ai_player.changeDirection();
    }
  }

  requestAnimationFrame(draw);
};

draw();

document.addEventListener("click", (e) => {
  // Enable shooting when the human player has ammo
  const doDefault = () => {
    if (human_player.getBulletCount() > 0 && game.getMode() === "play") {
      let x = human_player.x_body + playerWidth / 4 + playerWidth / 4;
      let y = canvas.height - 2 * playerHeight - bulletRadius;
      let spd = 10;
      human_player.addBullet({
        id: human_bullet_id.get(),
        bullet: new Bullet(x, y, spd, "#0095DD"),
      });
      human_bullet_id.next();
      human_player.useBullet();
    }
  };
  switch (e.target.outerText) {
    case "Play":
      game.play();
      break;
    case "Pause":
      game.pause();
      break;
    case "Game Instructions":
      game.pause();
      break;
    default:
      doDefault();
      break;
  }
});

document.querySelector("#open-inst").addEventListener("click", () => {
  document.querySelector("#inst").style.display = "flex";
});

document.querySelector("#close-inst").addEventListener("click", () => {
  document.querySelector("#inst").style.display = "none";
});

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener(
  "mousemove",
  (ele) => mouseMoveHandler(ele, human_player, canvas),
  false
);
