import Component from "../../core/Component.js";
import { gameInfoStore, myInfoStore } from "../../store/initialStates.js";
import {
  infoGameHandler,
  updateGameHandler,
  gameKeyDownHandler,
  gameReadyCountdownHandler,
} from "../../handlers/game/gameHandler.js";
import MultiGameResultModal from "./MultiGameResultModal.js";

export default class PongGame extends Component {
  setEvent() {
    const unsubscribe = gameInfoStore.subscribe(this);
    this.removeObservers.push(unsubscribe);

    infoGameHandler(this.removeObservers);
    updateGameHandler(
      (message) => this.updateGame(message),
      this.removeObservers
    );

    const { userId } = myInfoStore.getState();
    const { leftUserId, rightUserId } = gameInfoStore.getState();
    if ([leftUserId, rightUserId].includes(userId)) {
      gameKeyDownHandler(this.removeObservers);
    }
  }

  template() {
    const { tableHeight, tableWidth, leftScore, rightScore, status } =
      gameInfoStore.getState();

    return `
      <div
        id="match-score"
        class="position-absolute fw-bold text-white fs-3 start-50 translate-middle-x"
        style="top: -3rem;"
      >
        <span>${leftScore}</span> : <span>${rightScore}</span>
      </div>
      ${
        status === "before"
          ? `<div
              id="game-countdown"
              class="position-absolute start-50 top-50 fw-bold text-warning translate-middle"
              style="font-size: 5rem;"
            ></div>`
          : ""
      }
      <canvas
        width="${tableWidth}" height="${tableHeight}"
        class="mx-4 border border-white border-4 g-deep-blue-background px-2"
      ></canvas>
    `;
  }

  mounted() {
    const $canvas = this.$target.querySelector("canvas");
    const ctx = $canvas.getContext("2d");

    this.drawCenterLine(ctx, $canvas);
    this.drawBall(ctx, $canvas.width / 2, $canvas.height / 2);

    if (gameInfoStore.getState().status === "before") {
      gameReadyCountdownHandler(
        this.$target.querySelector("#game-countdown"),
        this.removeObservers
      );
    }

    this.handleGameEnd();
  }

  updateGame(data) {
    const { barWidth, barHeight, ballRadius } = gameInfoStore.getState();
    const $canvas = this.$target.querySelector("canvas");
    const ctx = $canvas.getContext("2d");

    const { leftBarX, leftBarY, rightBarX, rightBarY, ballX, ballY } = data;

    ctx.clearRect(0, 0, $canvas.width, $canvas.height);

    this.drawCenterLine(ctx, $canvas);
    this.drawBall(ctx, ballX, ballY, ballRadius);
    this.drawPaddle(ctx, leftBarX, leftBarY, barWidth, barHeight);
    this.drawPaddle(ctx, rightBarX, rightBarY, barWidth, barHeight);
  }

  drawCenterLine(ctx, $canvas) {
    ctx.strokeStyle = "#FFF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo($canvas.width / 2, 0);
    ctx.lineTo($canvas.width / 2, $canvas.height);
    ctx.stroke();
  }

  drawBall(ctx, x, y, ballRadius) {
    ctx.fillStyle = "#FFB800";
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  drawPaddle(ctx, x, y, barWidth, barHeight) {
    ctx.fillStyle = "#FFF";
    ctx.fillRect(x, y, barWidth, barHeight);
  }

  handleGameEnd() {
    const { gameType, status, winner } = gameInfoStore.getState();
    if (status !== "end") {
      return;
    }
    if (gameType === "multi_game") {
      const resultModal = new MultiGameResultModal(
        document.getElementById("modal-root"),
        { isWin: parseInt(winner, 10) === myInfoStore.getState().userId }
      );
      resultModal.render();
    }
  }
}
