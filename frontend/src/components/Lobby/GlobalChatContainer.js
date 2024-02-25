import Component from "../../core/Component.js";
import ChatInput from "./ChatInput.js";
import sendChatHandler from "../../handlers/chat/sendChatHandler.js";
import {
  receiveLogoutHandler,
  receiveTotalChatMessageHandler,
} from "../../handlers/chat/chatHandler.js";

export default class GlobalChatContainer extends Component {
  setEvent() {
    this.addEvent("keydown", "#global-chat-input", (e) =>
      sendChatHandler(e, "total_message")
    );
    this.addEvent("click", "#send-icon", () => {
      const $input = this.$target.querySelector("#global-chat-input");
      sendChatHandler({ target: $input, key: "Enter" }, "total_message");
    });

    receiveTotalChatMessageHandler(this.$target, this.removeObservers);
    receiveLogoutHandler(this.removeObservers);
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
    const chatInput = new ChatInput(
      this.$target.querySelector("#global-chat-input-holder"),
      { id: "global-chat-input", name: "global-chat-input" }
    );
    chatInput.render();
  }
}
