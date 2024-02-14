import Component from "../../core/Component.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";

export default class PlayerOverview extends Component {
  template() {
    const { id, nickname, wins, losses } = this.props;
    return `
      <div class="d-flex flex-column align-items-center">
        <div id="player-${id}-img-holder"></div>
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
            ${Math.round((wins / (wins + losses)) * 1000) / 10}%
          </span>
        </span>
      </div>
    `;
  }

  mounted() {
    const playerImage = new ProfileImage(
      this.$target.querySelector(`#player-${this.props.id}-img-holder`),
      { imageSize: "image-mid", imageSrc: "asset/default.png" }
    );

    playerImage.render();
  }
}
