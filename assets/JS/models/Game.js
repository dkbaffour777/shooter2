import { startGame } from "../startGame.js";

export class Game {
  constructor() {
    this.players = null;
    this.intervals = null;
    this.msgEle = null;
  }
  #mode = "play";
  #speed = 0;
  #isMobileView = false;
  getMode() {
    return this.#mode;
  }
  instantiateVals(players, intervals, msgEle) {
    this.players = players;
    this.intervals = intervals;
    this.msgEle = msgEle;
  }
  start() {
    startGame(this);
  }
  pause() {
    this.#mode = "pause";
    this.players.map((player) => player.stopMotion());
    this.msgEle.textContent = "Game Paused, Press Play to continue";
  }
  play() {
    this.#mode = "play";
    this.players.map((player) => player.startMotion());
    this.msgEle.textContent = "";
  }
  end(ai_player, msg, isSaveBulletData) {
    this.players.map((player) => {
      player.stopMotion();
      player.emptyBullets();
    });
    this.intervals.map((interval) => clearInterval(interval));
    setTimeout(() => {
      alert(msg);
      document.location.reload();
    }, 1000);
    isSaveBulletData && ai_player.saveCollectedData();
  }
  setSpeed(speed) {
    this.#speed = speed;
  }
  getSpeed() {
    return this.#speed;
  }
  getIsMobileView() {
    return this.#isMobileView;
  }
  setIsMobileView(value) {
    this.#isMobileView = value;
  }
}
