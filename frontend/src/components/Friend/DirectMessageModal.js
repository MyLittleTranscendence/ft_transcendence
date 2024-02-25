import Component from "../../core/Component.js";
import DirectMessageContainer from "./DirectMessageContainer.js";

export default class DirectMessageModal extends Component {
  template() {
    return `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title">DM</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div id="dm-container"></div>
          </div>
        </div>
      </div>
    `;
  }

  mounted() {
    const directMessageContainer = new DirectMessageContainer(
      this.$target.querySelector("#dm-container"),
      {
        receiverId: "Friend",
      }
    );

    directMessageContainer.render();
  }
}
