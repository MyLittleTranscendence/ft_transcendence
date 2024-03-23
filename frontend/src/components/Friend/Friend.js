import Component from "../../core/Component.js";
import FriendIcon from "../UI/Icon/FriendIcon.js";
import FriendListModal from "./FriendListModal.js";
import BlockListModal from "./BlockListModal.js";
import DirectMessageModal from "./DirectMessageModal.js";

export default class Friend extends Component {
  template() {
    return `
      <div id="dm-modal" class="modal fade"></div>
      <div id="friend-icon-holder"></div>
      <div id="friend-list-modal" class="modal fade"></div>
      <div id="block-list-modal" class="modal fade"></div>
    `;
  }

  mounted() {
    const directMessageModal = new DirectMessageModal(
      this.$target.querySelector("#dm-modal"),
      {},
      this
    );
    const friendIcon = new FriendIcon(
      this.$target.querySelector("#friend-icon-holder")
    );
    const friendListModal = new FriendListModal(
      this.$target.querySelector("#friend-list-modal")
    );
    const blockListModal = new BlockListModal(
      this.$target.querySelector("#block-list-modal")
    );

    directMessageModal.render();
    friendIcon.render();
    friendListModal.render();
    blockListModal.render();
  }
}
