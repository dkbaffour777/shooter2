export class Game {
  constructor(players, intervals, msgEle) {
    this.players = players;
    this.intervals = intervals;
    this.msgEle = msgEle;
  }
  #mode = "play";
  getMode() {
    return this.#mode;
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
  end(msg) {
    this.players.map((player) => {
      player.stopMotion();
      player.emptyBullets();
    });
    this.intervals.map((interval) => clearInterval(interval));
    setTimeout(() => {
      alert(msg);
      document.location.reload();
    }, 1000);
  }
}
