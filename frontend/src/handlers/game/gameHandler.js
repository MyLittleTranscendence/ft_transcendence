import { gameSocket } from "../../socket/socketManager.js";
import { gameInfoStore } from "../../store/initialStates.js";
import getRouter from "../../core/router.js";

const waitGameHandler = (removeObservers) => {
  const { addSocketObserver } = gameSocket();
  const removeObserver = addSocketObserver("wait_game", (message) => {
    const { navigateWithoutPushState } = getRouter();
    if (message.time <= 4) {
      navigateWithoutPushState("/game");
    }
  });

  removeObservers.push(removeObserver);
};

const infoGameHandler = (setPlayerInfo, removeObservers) => {
  const { addSocketObserver } = gameSocket();

  const removeObserver = addSocketObserver("info_game", (message) => {
    if (message.status === "before") {
      setPlayerInfo(
        message.left_user_id,
        message.right_user_id,
        message.next_left_player,
        message.next_right_player
      );
    }
    gameInfoStore.setState({
      barHeight: message.bar_height,
      barWidth: message.bar_width,
      ballRadius: message.circle_radius,
      gameType: message.game_type,
      leftScore: message.left_score,
      leftUserId: message.left_user_id,
      rightScore: message.right_score,
      rightUserId: message.right_user_id,
      tableHeight: message.screen_height,
      tableWidth: message.screen_width,
      status: message.status,
      winner: message.winner,
      nextLeftUserId: message.next_left_player,
      nextRightUserId: message.next_right_player,
    });
  });

  removeObservers.push(removeObserver);
};

const updateGameHandler = (updateGame, removeObservers) => {
  const { addSocketObserver } = gameSocket();

  const removeObserver = addSocketObserver("update_game", (message) => {
    updateGame({
      leftBarX: message.bar_x,
      leftBarY: message.bar_y,
      rightBarX: message.bar_right_x,
      rightBarY: message.bar_right_y,
      ballX: message.circle_x,
      ballY: message.circle_y,
    });
  });

  removeObservers.push(removeObserver);
};

const gameKeyDownHandler = (removeObservers) => {
  const { sendSocket } = gameSocket();

  let moveInterval;

  const startMoving = (command, event) => {
    event.preventDefault();
    if (!moveInterval) {
      moveInterval = setInterval(() => sendSocket("move_bar", { command }), 16);
    }
  };

  const stopMoving = () => {
    if (moveInterval) {
      clearInterval(moveInterval);
      moveInterval = null;
    }
  };

  const handleMultiAndTournamentGameKeyDown = (event) => {
    switch (event.key) {
      case "ArrowUp":
        startMoving("U", event);
        break;
      case "ArrowDown":
        startMoving("D", event);
        break;
      default:
    }
  };

  const handleSingleGameKeyDown = (event) => {
    switch (event.key) {
      case "ArrowUp":
        startMoving("U", event);
        break;
      case "ArrowDown":
        startMoving("D", event);
        break;
      case "w":
        startMoving("W", event);
        break;
      case "s":
        startMoving("S", event);
        break;
      default:
    }
  };

  const handleKeyUp = (event) => {
    const { key } = event;
    if (
      key === "ArrowUp" ||
      key === "ArrowDown" ||
      key === "w" ||
      key === "s"
    ) {
      stopMoving();
    }
  };

  const addKeyEventListener = (keydownFunc) => {
    window.addEventListener("keydown", keydownFunc);
    window.addEventListener("keyup", handleKeyUp);
    removeObservers.push(() =>
      window.removeEventListener("keydown", keydownFunc)
    );
    removeObservers.push(() =>
      window.removeEventListener("keyup", handleKeyUp)
    );
  };

  const { gameType } = gameInfoStore.getState();

  if (gameType === "multi_game" || gameType === "tournament_game") {
    addKeyEventListener(handleMultiAndTournamentGameKeyDown);
  } else if (gameType === "single_game") {
    addKeyEventListener(handleSingleGameKeyDown);
  }
};

const gameReadyCountdownHandler = ($element, removeObservers) => {
  const { addSocketObserver } = gameSocket();

  const $counter = $element;

  const removeObserver = addSocketObserver("wait_game", (message) => {
    if (message.time > 3) {
      return;
    }
    if (message.time === 0) {
      $counter.textContent = "Start!";
      setTimeout(() => {
        $counter.textContent = "";
      }, 980);
      return;
    }
    $counter.textContent = message.time;
  });

  removeObservers.push(removeObserver);
};

export {
  waitGameHandler,
  infoGameHandler,
  updateGameHandler,
  gameKeyDownHandler,
  gameReadyCountdownHandler,
};
