import Component from "../../core/Component.js";
import formatTime from "../../utils/formatTime.js";

export default class DirectMessage extends Component {
  template() {
    const { content, senderId, senderNickname, datetime } = this.props;

    return `
      <div class="d-flex">
        <div class="ms-2">
          <span class="fw-bold g-light-grey">
            ${senderNickname}
            <span class="text-warning fw-light fst-italic fs-6">
              ${formatTime(datetime)}
            </span>
          </span>
          <p class="g-light-grey">
            ${content}
          </p>
        </div>
      </div>
    `;
  }
}
