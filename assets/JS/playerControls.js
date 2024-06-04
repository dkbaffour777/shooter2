export let rightPressed = false;
export let leftPressed = false;

export const keyDownHandler =(e)=> {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

export const keyUpHandler =(e)=> {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

export const mouseMoveHandler =(ele, player_human, canvas)=> {
    let relativeX = ele.clientX - canvas.offsetLeft;
    if (player_human.motion() && relativeX > 0 && relativeX < canvas.width) {
        player_human.x_body = relativeX - player_human.width / 2;
    }
}

