import Component from "../../core/Component.js";
import { myInfoStore } from "../../store/initialStates.js";
import formatTime from "../../utils/formatTime.js";

export default class DirectMessage extends Component {
  template() {
    const { content, senderId, senderNickname, datetime } = this.props;
    const { userId: myId } = myInfoStore.getState();
    const isMe = senderId === myId;

    return `
      <div class="d-flex">
        <div class="ms-2">
          <span class="fw-bold ${isMe ? "text-primary" : "g-grey"}">
            ${isMe ? "Me" : senderNickname}
            <span class="g-light-grey fw-light fst-italic fs-6">
              ${formatTime(datetime)}
            </span>
          </span>
          <p class="g-dark-grey">
            ${content}
          </p>
        </div>
      </div>
    `;
  }
}
