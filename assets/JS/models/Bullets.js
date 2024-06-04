export class Bullets {
    #currentBullets = [];
    add(bullet) {
        this.#currentBullets.push(bullet);
    }
    remove(id) {
        this.#currentBullets = this.#currentBullets.filter(bullet => bullet.id !== id);
    }
    empty() {
        this.#currentBullets = [];
    }
    get() {
        return this.#currentBullets;
    }
};