import Component from "../core/Component.js";
import ProfileImage from "../components/UI/Profile/ProfileImage.js";
import GameCanvas from "../components/Game/GameCanvas.js";
import NextMatchBox from "../components/Game/NextMatchBox.js";
import fetchUserInfo from "../api/user/fetchUserInfo.js";
import { gameInfoStore } from "../store/initialStates.js";
import { gameSocket } from "../socket/socketManager.js";

export default class PongGamePage extends Component {
  async setup() {
    this.state = { leftUser: null, rightUser: null };

    const unsubscribe = gameInfoStore.subscribe(this);
    this.removeObservers.push(unsubscribe);

    const gameInfo = gameInfoStore.getState();

    if (gameInfo.leftUserId !== 0 && gameInfo.rightUserId !== 0) {
      const leftUser = await fetchUserInfo(gameInfo.leftUserId);
      const rightUser = await fetchUserInfo(gameInfo.leftUserId);

      this.setState({ leftUser, rightUser });
    }
  }

  setEvent() {
    const { addSocketObserver } = gameSocket();

    const removeObserver = addSocketObserver("info_game", (message) => {
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
    });

    this.removeObservers.push(removeObserver);
  }

  template() {
    const { leftUser, rightUser } = this.state;

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
            <div class="text-white fw-bold">${rightUser?.nickname}</div>
          </div>
          <div id="game-canvas-holder"></div>
          <div class="d-flex flex-column align-items-center">
            <div id="player-1-img-holder"></div>
            <div class="text-warning fw-bold">${leftUser?.nickname}</div>
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
      { imageSize: "image-sm", imageSrc: this.state.leftUser?.profileImage }
    );
    const rightUserImage = new ProfileImage(
      this.$target.querySelector("#player-2-img-holder"),
      { imageSize: "image-sm", imageSrc: this.state.rightUser?.profileImage }
    );
    gameCanvas.render();
    leftUserImage.render();
    rightUserImage.render();

    // if (this.props.nextMatch) {
    //   const nextMatchBox = new NextMatchBox(
    //     this.$target.querySelector("#next-match-box-holder"),
    //     this.props.nextMatch
    //   );
    //   nextMatchBox.render();
    // }
  }
}
