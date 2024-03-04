import Component from "../../core/Component.js";
import FriendIcon from "../UI/Icon/FriendIcon.js";
import FriendListModal from "./FriendListModal.js";
import BlockListModal from "./BlockListModal.js";
import DirectMessageModal from "./DirectMessageModal.js";
import { friendListStore } from "../../store/initialStates.js";

export default class Friend extends Component {
  setup() {
    friendListStore.subscribe(this);
  }

  template() {
    const { friends } = friendListStore.getState();
    let dmModals = "";
    if (friends.length > 0)
      dmModals = `${friends.map((friend) => `<div id="dm-modal-${friend.userId}" class="modal fade"></div>`).join("")}`;
    return `
      <div id="friend-icon-holder"></div>
      <div id="friend-list-modal" class="modal fade"></div>
      <div id="block-list-modal" class="modal fade"></div>
      ${dmModals}
    `;
  }

  mounted() {
    const friendIcon = new FriendIcon(
      this.$target.querySelector("#friend-icon-holder")
    );
    const friendListModal = new FriendListModal(
      this.$target.querySelector("#friend-list-modal")
    );
    const blockListModal = new BlockListModal(
      this.$target.querySelector("#block-list-modal")
    );

    friendIcon.render();
    friendListModal.render();
    blockListModal.render();

    const { friends } = friendListStore.getState();
    if (friends.length > 0) {
      friends.forEach((friend) => {
        const directMessageModal = new DirectMessageModal(
          this.$target.querySelector(`#dm-modal-${friend.userId}`),
          {
            profileImage: friend.profileImage,
            nickname: friend.nickname,
            userId: friend.userId,
          }
        );

        directMessageModal.render();
      });
    }
  }
}
