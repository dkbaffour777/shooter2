import { ctx } from "../canvas.js";

export let playerHeight = 10;
export let playerWidth = 45;

const drawRectangle = (x, y, width, height, color) => {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

const drawPlayerHead = (x, y, color) => {
    drawRectangle(
        x,
        y,
        playerWidth / 2,
        playerHeight,
        color
    );
}

const drawPlayerBody = (x, y, color) => {
    drawRectangle(
        x,
        y,
        playerWidth,
        playerHeight,
        color
    );
}

export class Player {
    constructor(y_head, x_body, y_body, color) {
        this.y_head = y_head;
        this.x_body = x_body;
        this.y_body = y_body;
        this.color = color;
        this.height = 10;
        this.width = 45;
    }
    #ammo = 2;
    #isMotion = true;
    resetAmmo() {
        this.#ammo = 2;
    }
    getAmmo() {
        return this.#ammo;
    }
    useAmmo() {
        this.#ammo -= 1;
    }
    stopMotion() {
        this.#isMotion = false;
    }
    startMotion() {
        this.#isMotion = true;
    }
    motion() {
        return this.#isMotion;
    }
    draw() {
        drawPlayerHead(
            this.x_body + (playerWidth / 4),
            this.y_head,
            this.color
        );
        drawPlayerBody(
            this.x_body,
            this.y_body,
            this.color
        );
    }
};
