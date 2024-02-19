import Component from "../../core/Component.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import GameCanvas from "./GameCanvas.js";
import NextMatchBox from "./NextMatchBox.js";

export default class PongGame extends Component {
  template() {
    const { leftUser, rightUser } = this.props.currentMatch;

    return `
      <div
        class="d-flex flex-column justify-content-center align-items-center"
        style="height: 100vh"
      >
        <div class="d-flex align-items-center position-relative">
          <div
            id="match-countdown-and-score"
            class="position-absolute fw-bold text-white fs-3 start-50 translate-middle-x"
            style="top: -3rem;"
          >
            3
          </div>
          <div
            id="next-match-box-holder"
            class="position-absolute translate-middle-x"
            style="top: -7rem; right: -2.5rem;"
          ></div>
          <div class="d-flex flex-column align-items-center">
            <div id="player-2-img-holder"></div>
            <div class="text-white fw-bold">${rightUser.nickname}</div>
          </div>
          <div id="game-canvas-holder"></div>
          <div class="d-flex flex-column align-items-center">
            <div id="player-1-img-holder"></div>
            <div class="text-warning fw-bold">${leftUser.nickname}</div>
          </div>
        </div>
        <div class="mt-5" style="width: 10rem">
          <img src="asset/logo-medium.png" class="img-fluid"/>
        </div>
      </div>
    `;
  }

  mounted() {
    const gameCanvas = new GameCanvas(
      this.$target.querySelector("#game-canvas-holder")
    );
    const leftUserImage = new ProfileImage(
      this.$target.querySelector("#player-1-img-holder"),
      { imageSize: "image-sm", imageSrc: "asset/default.png" }
    );
    const rightUserImage = new ProfileImage(
      this.$target.querySelector("#player-2-img-holder"),
      { imageSize: "image-sm", imageSrc: "asset/default.png" }
    );
    gameCanvas.render();
    leftUserImage.render();
    rightUserImage.render();

    if (this.props.nextMatch) {
      const nextMatchBox = new NextMatchBox(
        this.$target.querySelector("#next-match-box-holder"),
        this.props.nextMatch
      );
      nextMatchBox.render();
    }

    let countdown = 3;
    const $counter = this.$target.querySelector("#match-countdown-and-score");

    const timer = setInterval(() => {
      countdown -= 1;
      $counter.innerText = countdown;
      if (countdown <= 0) {
        clearInterval(timer);
        $counter.innerText = "0 : 0";
        // gameCanvas.startGame();
      }
    }, 1000);
  }
}
