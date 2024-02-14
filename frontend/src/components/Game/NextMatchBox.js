import Component from "../../core/Component.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";

export default class NextMatchBox extends Component {
  template() {
    const { player1, player2 } = this.props;

    return `
      <div
        class="d-flex flex-column align-items-center p-3 g-deep-blue-background"
        style="border-radius: 1rem;"
      >
        <h6 class="text-white">Next Match</h6>
        <div class="d-flex align-items-center text-warning fw-bold">
          <div id="next-player-1-holder"></div>
          <div class="mx-2 text-white">${player1.nickname}</div>
          vs
          <div class="mx-2 text-white">${player2.nickname}</div>
          <div id="next-player-2-holder"></div>
        </div>
      </div>
    `;
  }

  mounted() {
    const player1Image = new ProfileImage(
      this.$target.querySelector("#next-player-1-holder"),
      {
        imageSrc: "asset/default.png",
        imageSize: "image-xs",
      }
    );
    const player2Image = new ProfileImage(
      this.$target.querySelector("#next-player-2-holder"),
      {
        imageSrc: "asset/default.png",
        imageSize: "image-xs",
      }
    );
    player1Image.render();
    player2Image.render();
  }
}
