import fetchUserInfo from "../../api/user/fetchUserInfo.js";
import Component from "../../core/Component.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";

export default class PlayerOverview extends Component {
  async setup() {
    this.state = {
      userId: 0,
      nickname: "",
      wins: 0,
      losses: 0,
    };

    const userInfo = await fetchUserInfo(this.props.userId);

    this.setState(userInfo);
  }

  template() {
    const { userId, nickname, wins, losses } = this.state;
    return `
      <div class="d-flex flex-column align-items-center">
        <div id="player-${userId}-img-holder"></div>
        <span
          class="text-warning fs-5 fw-bold mb-3"
        >${nickname}</span>
        <span class="g-light-grey fw-bold mb-2">
          Win<span class="text-white ms-3">${wins}</span>
        </span>
        <span class="g-light-grey fw-bold mb-3">
          Lost<span class="text-white ms-3">${losses}</span>
        </span>
        <span class="g-light-grey fw-bold">
          Win Rate
          <span class="text-white ms-3">
            ${wins === 0 && losses === 0 ? "-" : Math.round((wins / (wins + losses)) * 1000) / 10}%
          </span>
        </span>
      </div>
    `;
  }

  mounted() {
    const playerImage = new ProfileImage(
      this.$target.querySelector(`#player-${this.state.userId}-img-holder`),
      { imageSize: "image-mid", imageSrc: this.state.profileImage }
    );

    playerImage.render();
  }
}
