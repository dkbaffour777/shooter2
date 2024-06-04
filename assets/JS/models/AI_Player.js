import { Player } from "./Player.js";

export class AI_Player extends Player {
    #direction = 1;

    getDirection() {
        if(!this.motion()) {
            this.#direction = 0;
        }
        else if (this.#direction === 0 && this.motion()) this.#direction = 1;

        return this.#direction;
    }
    changeDirection() {
        if(this.#direction === 1) this.#direction = -1;
        else if (this.#direction === -1) this.#direction = 1;
    }
}