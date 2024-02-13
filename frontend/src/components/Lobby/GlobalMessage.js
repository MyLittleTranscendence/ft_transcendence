import Component from "../../core/Component.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import formatTime from "../../utils/formatTime.js";

export default class GlobalMessage extends Component {
  template() {
    const { userID, nickname, dateTime, content } = this.props;
    return `
      <div class="d-flex">
        <div id="sender-img-holder" class="pt-1 ps-1"></div>
        <div class="ms-2">
          <span class="fw-bold g-light-grey">
            ${nickname}
            <span class="text-warning fw-light fst-italic fs-6">
              ${formatTime(dateTime)}
            </span>
          </span>
          <p class="text-white">
            ${content}
          </p>
        </div>
      </div>
    `;
  }

  mounted() {
    const senderImage = new ProfileImage(
      this.$target.querySelector("#sender-img-holder"),
      { imageSize: "image-xs", imageSrc: this.props.imageSrc }
    );
    senderImage.render();
  }
}
