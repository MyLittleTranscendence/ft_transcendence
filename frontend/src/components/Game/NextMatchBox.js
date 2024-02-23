import Component from "../../core/Component.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";

export default class NextMatchBox extends Component {
  template() {
    const { leftUser, rightUser } = this.props;

    return `
      <div
        class="d-flex flex-column align-items-center p-3 g-deep-blue-background"
        style="border-radius: 1rem;"
      >
        <h6 class="text-white">Next Match</h6>
        <div class="d-flex align-items-center text-warning fw-bold">
          <div class="d-flex align-items-center justify-content-center">
            <div id="next-player-1-holder"></div>
            <div class="text-white ms-2">${leftUser ? leftUser.nickname : "TBD"}</div>
          </div>
          <div class="mx-2">vs</div>
          <div class="d-flex align-items-center justify-content-center">
            <div class="text-white me-2">${rightUser ? rightUser.nickname : "TBD"}</div>
            <div id="next-player-2-holder"></div>
          </div>
        </div>
      </div>
    `;
  }

  mounted() {
    const { leftUser, rightUser } = this.props;

    const leftUserImage = new ProfileImage(
      this.$target.querySelector("#next-player-1-holder"),
      {
        imageSrc: leftUser ? leftUser.profileImage : "asset/question_mark.png",
        imageSize: "image-xs",
      }
    );
    const rightUserImage = new ProfileImage(
      this.$target.querySelector("#next-player-2-holder"),
      {
        imageSrc: rightUser
          ? rightUser.profileImage
          : "asset/question_mark.png",
        imageSize: "image-xs",
      }
    );
    leftUserImage.render();
    rightUserImage.render();
  }
}
