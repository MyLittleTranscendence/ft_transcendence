import { gameSocket } from "../../socket/socketManager.js";
import showToast from "../../utils/showToast.js";
import { gameInfoStore } from "../../store/initialStates.js";
import getRouter from "../../core/router.js";

const matchFindHandler = (matchType) => {
  const { sendSocket } = gameSocket();

  const queueTypes = {
    "1 vs 1": "join_multi_game_queue",
    Tournament: "join_tournament_game_queue",
    "Single Play": "single_game_create",
  };

  sendSocket(queueTypes[matchType]);
};

const cancleMatchFindHandler = (matchType) => {
  const { sendSocket } = gameSocket();

  const queueTypes = {
    "1 vs 1": "delete_multi_game_queue",
    Tournament: "delete_tournament_game_queue",
  };

  sendSocket(queueTypes[matchType]);
};

const queueParticipantCountUpdateHandler = ($target, removeObservers) => {
  const { addSocketObserver } = gameSocket();

  const $counter = $target;
  const removeObserver = addSocketObserver("queue_update", (message) => {
    $counter.querySelector("#participant-count").textContent = message.cnt;
  });

  removeObservers.push(removeObserver);
};

const matchFoundHandler = (setState, removeObservers) => {
  const { addSocketObserver } = gameSocket();

  const removeObserver = addSocketObserver("request_accept_queue", (message) =>
    setState({
      isMatchFound: true,
      isJoined: false,
      matchSessionId: message.session_id,
    })
  );

  removeObservers.push(removeObserver);
};

const joinMatchHandler = (matchSessionId) => {
  const { sendSocket } = gameSocket();

  sendSocket("response_accept_queue", { session_id: matchSessionId });
};

const fallbackToMatchFindHandler = (setState, removeObservers) => {
  const { addSocketObserver } = gameSocket();

  const removeObserver = addSocketObserver("match_fail", () => {
    showToast("Match making failed.");
    setState({ isMatchFound: false, matchSessionId: "" });
  });

  removeObservers.push(removeObserver);
};

const penaltyWaitHandler = (setState, removeObservers) => {
  const { addSocketObserver } = gameSocket();

  const removeObserver = addSocketObserver("penalty_wait", (message) => {
    const penaltyEndTime = new Date(message.penalty_time).getTime();
    const currentTime = new Date().getTime();
    const penaltyDuration = penaltyEndTime - currentTime;

    if (penaltyDuration > 0) {
      setState({ isPenalty: true, waitTime: penaltyDuration });
    } else {
      setState({ isPenalty: false });
    }
  });

  removeObservers.push(removeObserver);
};

const matchSuccessHandler = (removeObservers) => {
  const { addSocketObserver } = gameSocket();

  const removeObserver = addSocketObserver("match_success", () => {
    showToast("Match has made successfully!");
  });

  removeObservers.push(removeObserver);
};

const createSingleGameHandler = () => {
  const { sendSocket } = gameSocket();

  sendSocket("single_game_create");
};

const getGameInfoHandler = (removeObservers) => {
  const { addSocketObserver } = gameSocket();

  const removeObserver = addSocketObserver("info_game", (message) => {
    const { navigateWithoutPushState } = getRouter();

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
    });

    const { gameType, status } = gameInfoStore.getState();
    if (status === "before") {
      if (gameType === "multi_game") {
        navigateWithoutPushState("/pvp-ready");
      } else if (gameType === "tournament_game") {
        navigateWithoutPushState("/tournament-ready");
      } else if (gameType === "single_game") {
        navigateWithoutPushState("/game");
      }
    } else if (status === "start") {
      navigateWithoutPushState("/game");
    }
  });

  removeObservers.push(removeObserver);
};

export {
  matchFindHandler,
  cancleMatchFindHandler,
  queueParticipantCountUpdateHandler,
  matchFoundHandler,
  joinMatchHandler,
  fallbackToMatchFindHandler,
  penaltyWaitHandler,
  matchSuccessHandler,
  createSingleGameHandler,
  getGameInfoHandler,
};
