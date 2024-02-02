import Component from "../../core/Component.js";
import ChatInput from "./ChatInput.js";

export default class GlobalChatContainer extends Component {
  template() {
    return `
      <div
        id="global-chat-container"
        class="
          position-relative
          col
          d-flex
          flex-column
          align-items-center
          border border-white border-5
          p-2
          "
        style="background-color: #0049D8;"
      >
        <h3 class="text-white">
          Chat (Global)
        </h2>
        <div
          class="border border-1"
          style="width: 90%;"
        ></div>
        <div id="global-chat-message-container"></div>
        <div
          id="global-chat-input-holder"
          class="
            position-absolute bottom-0
            traslate-middle
            p-2
            w-100
          "></div>
      </div>
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
