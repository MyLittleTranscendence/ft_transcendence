import Component from "../../core/Component.js";
import ChatInput from "../Lobby/ChatInput.js";
import DirectMessage from "./DirectMessage.js";
import sendChatHandler from "../../handlers/chat/sendChatHandler.js";
import { chatSocket } from "../../socket/socketManager.js";

export default class DirectMessageContainer extends Component {
  setEvent() {
    this.addEvent("keydown", "#dm-chat-input", (e) =>
      sendChatHandler(e, "single_message", this.props.receiverId)
    );
    this.addEvent("click", "#send-icon", () => {
      const $input = this.$target.querySelector("#dm-chat-input");
      sendChatHandler(
        { target: $input, key: "Enter" },
        "single_message",
        this.props.receiverId
      );
    });
  }

  template() {
    return `
      <div class="card border-0">
        <div class="card-header text-center">
          <h4 class="text-muted">${this.props.receiverId}</h4>
        </div>
        <div class="card-body">
          <div
            id="dm-chat-message-container"
            class="w-100 mh-100 overflow-auto mt-1"
          >
            <ul id="dm-chat-message-ul" class="list-unstyled"></ul>
          </div>
        </div>
        <div class="card-footer">
          <div
            id="dm-chat-input-holder"
          ></div>
        </div>
      </div>
    `;
  }

  mounted() {
    const { addSocketObserver } = chatSocket();

    const chatInput = new ChatInput(
      this.$target.querySelector("#dm-chat-input-holder"),
      { id: "dm-chat-input", name: "dm-chat-input" }
    );
    chatInput.render();

    const $messageContainer = this.$target.querySelector(
      "#dm-chat-message-container"
    );
    const $messageUL = $messageContainer.querySelector("#dm-chat-message-ul");

    const removeObserver = addSocketObserver("single_message", (message) => {
      const $messageLI = document.createElement("li");
      const directMessage = new DirectMessage($messageLI, {
        content: message.message,
        senderId: message.sender_id,
        senderNickname: message.sender_nickname,
        senderProfileImage: message.sender_profile_image,
        datetime: message.datetime,
      });
      directMessage.render();
      $messageLI.id = `dm-${message.datetime}`;
      $messageUL.appendChild($messageLI);
      $messageContainer.scrollTop = $messageContainer.scrollHeight;
    });
    this.removeObservers.push(removeObserver);
  }
}
