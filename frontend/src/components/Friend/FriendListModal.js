import Component from "../../core/Component.js";
import FriendList from "./FriendList.js";

export default class FriendListModal extends Component {
  template() {
    return `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Friends</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
            <div id="friend-list-holder" class="modal-body"></div>
            <div class="modal-footer">
              <button
                class="btn"
                data-bs-target="#block-list-modal"
                data-bs-toggle="modal"
              >Block</button>
            </div>
        </div>
      </div>
    `;
  }

  mounted() {
    const friendList = new FriendList(
      this.$target.querySelector("#friend-list-holder"),
      this
    );

    friendList.render();
  }
}
