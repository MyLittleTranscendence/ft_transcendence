import Component from "../../core/Component.js";

export default class GameCanvas extends Component {
  template() {
    return `
      <canvas
        width="800" height="500"
        class="mx-4 border border-white border-4 g-deep-blue-background"
      ></canvas>
    `;
  }

  mounted() {
    const canvas = this.$target.querySelector("canvas");

    const ctx = canvas.getContext("2d");
    const ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 7 };

    const drawBall = () => {
      ctx.fillStyle = "#FFB800";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawCenterLine = () => {
      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
    };

    const paddleWidth = 10;
    const paddleHeight = 100;
    const paddleMargin = 10;

    const leftPaddle = {
      x: paddleMargin,
      y: canvas.height / 2 - paddleHeight / 2,
    };
    const rightPaddle = {
      x: canvas.width - paddleMargin - paddleWidth,
      y: canvas.height / 2 - paddleHeight / 2,
    };
    const drawPaddle = (x, y) => {
      ctx.fillStyle = "#FFF";
      ctx.fillRect(x, y, paddleWidth, paddleHeight);
    };

    drawCenterLine();
    drawBall();
    drawPaddle(leftPaddle.x, leftPaddle.y);
    drawPaddle(rightPaddle.x, rightPaddle.y);
  }

  startGame() {}
}
