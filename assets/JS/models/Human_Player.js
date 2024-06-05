import { Player } from "./Player.js";

export class Human_Player extends Player {
  #bulletLimit = 5;
  #bulletCount = this.#bulletLimit;
  #ammoPack = [];
  resetBulletCount() {
    this.#bulletCount = this.#bulletLimit;
  }
  getBulletCount() {
    return this.#bulletCount;
  }
  useBullet() {
    this.#bulletCount -= 1;
  }
  addAmmo(ammo) {
    this.#ammoPack.push(ammo);
  }
  removeAmmo(id) {
    this.#ammoPack = this.#ammoPack.filter((ammo) => ammo.id !== id);
  }
  emptyAmmoPack() {
    this.#ammoPack = [];
  }
  getAmmoPack() {
    return this.#ammoPack;
  }
}
