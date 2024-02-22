import Component from "../core/Component.js";
import ProfileImage from "../components/UI/Profile/ProfileImage.js";
import PongGame from "../components/Game/PongGame.js";
import NextMatchBox from "../components/Game/NextMatchBox.js";
import fetchUserInfo from "../api/user/fetchUserInfo.js";
import { gameInfoStore, myInfoStore } from "../store/initialStates.js";

export default class PongGamePage extends Component {
  setup() {
    this.state = {
      leftUser: null,
      rightUser: null,
      nextLeftUser: null,
      nextRightUser: null,
    };
    const { leftUserId, rightUserId, nextLeftUserId, nextRightUserId } =
      gameInfoStore.getState();
    this.setPlayerInfo(
      leftUserId,
      rightUserId,
      nextLeftUserId,
      nextRightUserId
    );
  }

  template() {
    const { leftUser, rightUser } = this.state;
    const { userId: myId } = myInfoStore.getState();

    return `
      <div
        class="d-flex flex-column justify-content-center align-items-center"
        style="height: 100vh"
      >
        <div class="d-flex align-items-center position-relative">
          <div
            id="next-match-box-holder"
            class="position-absolute translate-middle-x"
            style="top: -7rem; right: -2.5rem;"
          ></div>
          <div class="d-flex flex-column align-items-center">
            <div id="player-2-img-holder"></div>
            <div
              class="${myId === leftUser?.userId ? "text-warning" : "text-white"} fw-bold"
            >${leftUser?.nickname}</div>
          </div>
          <div id="pong-game-holder" class="position-relative"></div>
          <div class="d-flex flex-column align-items-center">
            <div id="player-1-img-holder"></div>
            <div 
              class="${myId === rightUser?.userId ? "text-warning" : "text-white"} fw-bold"
              >${rightUser?.nickname}</div>
          </div>
        </div>
        <div class="mt-5" style="width: 10rem">
          <img src="asset/logo-medium.png" class="img-fluid"/>
        </div>
      </div>
    `;
  }

  mounted() {
    const pongTable = new PongGame(
      this.$target.querySelector("#pong-game-holder"),
      {
        setPlayerInfo: (
          leftUserId,
          rightUserId,
          nextLeftUserId,
          nextRightUserId
        ) =>
          this.setPlayerInfo(
            leftUserId,
            rightUserId,
            nextLeftUserId,
            nextRightUserId
          ),
        myId: myInfoStore.getState().userId,
      }
    );
    const leftUserImage = new ProfileImage(
      this.$target.querySelector("#player-1-img-holder"),
      { imageSize: "image-sm", imageSrc: this.state.leftUser?.profileImage }
    );
    const rightUserImage = new ProfileImage(
      this.$target.querySelector("#player-2-img-holder"),
      { imageSize: "image-sm", imageSrc: this.state.rightUser?.profileImage }
    );
    pongTable.render();
    leftUserImage.render();
    rightUserImage.render();

    if (this.state.nextLeftUser || this.state.nextRightUser) {
      const nextMatchBox = new NextMatchBox(
        this.$target.querySelector("#next-match-box-holder"),
        {
          leftUser: this.state.nextLeftUser,
          rightUser: this.state.nextRightUser,
        }
      );
      nextMatchBox.render();
    }
  }

  async setPlayerInfo(
    leftUserId,
    rightUserId,
    nextLeftUserId,
    nextRightUserId
  ) {
    if (leftUserId !== 0 && rightUserId !== 0) {
      const leftUser = await fetchUserInfo(leftUserId);
      const rightUser = await fetchUserInfo(rightUserId);

      let nextLeftUser = null;
      let nextRightUser = null;

      if (nextLeftUserId && nextLeftUserId !== "NONE") {
        nextLeftUser = await fetchUserInfo(nextLeftUserId);
      }
      if (nextRightUserId && nextRightUserId !== "NONE") {
        nextRightUser = await fetchUserInfo(nextRightUserId);
      }

      this.setState({ leftUser, rightUser, nextLeftUser, nextRightUser });
    }
  }
}
