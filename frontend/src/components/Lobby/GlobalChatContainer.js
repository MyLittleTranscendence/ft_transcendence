import Component from "../../core/Component.js";
import ChatInput from "./ChatInput.js";
import sendChatHandler from "../../handlers/chat/sendChatHandler.js";
import { chatSocket } from "../../socket/socketManager.js";
import GlobalMessage from "./GlobalMessage.js";

export default class GlobalChatContainer extends Component {
  setEvent() {
    this.addEvent("keydown", "#global-chat-input", (e) =>
      sendChatHandler(e, "total_message")
    );
    this.addEvent("click", "#global-send-icon", () => {
      const $input = this.$target.querySelector("#global-chat-input");
      sendChatHandler({ target: $input, key: "Enter" }, "total_message");
    });
  }

  template() {
    return `
      <h3 class="text-white">
        Chat (Global)
      </h2>
      <div
        class="border border-1"
        style="width: 90%;"
      ></div>
      <div
        id="global-chat-message-container"
        class="w-100 mh-100 overflow-auto mt-1"
        style="margin-bottom: 2rem;"
      >
        <ul
          id="global-chat-message-ul"
          class="list-unstyled"
        ></ul>
      </div>
      <div
        id="global-chat-input-holder"
        class="
          position-absolute bottom-0
          traslate-middle
          p-2
          w-100
        "
      ></div>
    `;
  }

  mounted() {
    const { addSocketObserver } = chatSocket();

    const chatInput = new ChatInput(
      this.$target.querySelector("#global-chat-input-holder"),
      { id: "global-chat-input", name: "global-chat-input" }
    );
    chatInput.render();

    const $messageContainer = this.$target.querySelector(
      "#global-chat-message-container"
    );
    const $messageUL = $messageContainer.querySelector(
      "#global-chat-message-ul"
    );

    const removeObserver = addSocketObserver("total_message", (message) => {
      const $messageLI = document.createElement("li");
      const globalMessage = new GlobalMessage($messageLI, {
        content: message.message,
        senderId: message.sender_id,
        senderNickname: message.sender_nickname,
        senderProfileImage: message.sender_profile_image,
        datetime: message.datetime,
      });
      globalMessage.render();
      $messageLI.id = `global-${message.datetime}`;
      $messageUL.appendChild($messageLI);
      $messageContainer.scrollTop = $messageContainer.scrollHeight;
    });
    this.removeObservers.push(removeObserver);
  }
}
