export let rightPressed = false;
export let leftPressed = false;

export const keyDownHandler = (e) => {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
};

export const keyUpHandler = (e) => {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
};

export const mobileControls = () => {
  const controlEffect = (event, isPressed, color) => {
    const control = event.target.id;
    switch (control) {
      case "left":
        leftPressed = isPressed;
        break;
      case "right":
        rightPressed = isPressed;
        break;
    }
    if (["left", "right"].includes(control))
      document.querySelector(`#${control}`).style.backgroundColor = color;
  };
  document.addEventListener("touchstart", (event) => {
    controlEffect(event, true, "#1298a9");
  });

  document.addEventListener("touchend", (event) => {
    controlEffect(event, false, "#777");
  });
};

export const mouseMoveHandler = (ele, player_human, canvas) => {
  let relativeX = ele.clientX - canvas.offsetLeft;
  if (player_human.motion() && relativeX > 0 && relativeX < canvas.width) {
    player_human.x_body = relativeX - player_human.width / 2;
  }
};
