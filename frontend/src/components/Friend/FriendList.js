import Component from "../../core/Component.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import onlineCheckHandler from "../../handlers/chat/onlineCheckHandler.js";
import {
  friendListStore,
  friendOnlineStatusStore,
} from "../../store/initialStates.js";
import blockUserHandler from "../../handlers/user/blockUserHandler.js";
import { inviteUserHandler } from "../../handlers/game/inviteUserHandler.js";
import OnlineIcon from "../UI/Icon/OnlineIcon.js";

export default class FriendList extends Component {
  setup() {
    friendListStore.subscribe(this);
    friendOnlineStatusStore.subscribe(this);
  }

  setEvent() {
    this.addEvent("click", "#invite-trigger", (e) => {
      inviteUserHandler(parseInt(e.target.getAttribute("data-user-id"), 10));
    });
    this.addEvent("click", "#block-trigger", (e) => {
      blockUserHandler(parseInt(e.target.getAttribute("data-user-id"), 10));
    });

    onlineCheckHandler(this.removeObservers);
  }

  template() {
    const { friends } = friendListStore.getState();

    if (friends.length === 0) {
      return `
        <div class="d-flex justify-content-center">
          <h4 class="fw-bold g-light-grey">No friends.</h4>
        </div>
      `;
    }

    return `
      <div class="list-group list-group-flush">
        ${friends
          .map(
            (friend) => `
            <div class="dropdown dropend">
              <div
                class="
                  list-group-item
                  list-group-item-action
                  d-flex
                  align-items-center
                  px-0
                  border-0
                "
                type="button"
                data-bs-toggle="dropdown"
              >
                <div class="position-relative">
                  <div id="friend-profile-${friend.userId}"></div>
                  <div id="online-icon-${friend.userId}"></div>
                </div>
                <span class="mx-3">
                  <h5 class="fw-bold mb-1">${friend.nickname}</h5>
                  <small class="g-light-grey">click here to send message</small>
                </span>
              </div>
              <ul class="dropdown-menu">
                <li>
                  <button
                    class="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#dm-modal-${friend.userId}"
                  >
                    DM
                  </button>
                </li>
                <li><a
                  href="/profile?user_id=${friend.userId}"
                  class="dropdown-item"
                  data-bs-dismiss="modal"
                  data-link
                  >
                    Profile
                </a></li>
                <li><button
                  id="invite-trigger"
                  class="dropdown-item"
                  data-bs-dismiss="modal"
                  data-user-id="${friend.userId}"
                >1 vs 1</button></li>
                <li><hr class="dropdown-divider"></li>
                <li><button
                  id="block-trigger"
                  class="dropdown-item text-danger"
                  data-bs-dismiss="modal"
                  data-user-id="${friend.userId}"
                >Block</button></li>
              </ul>
            </div>
          `
          )
          .join("")}
      </div>
    `;
  }

  mounted() {
    const { friends } = friendListStore.getState();
    const { onlineStatus } = friendOnlineStatusStore.getState();

    if (friends.length > 0) {
      friends.forEach((friend) => {
        const friendProfile = new ProfileImage(
          this.$target.querySelector(`#friend-profile-${friend.userId}`),
          {
            imageSize: "image-sm",
            imageSrc: friend.profileImage,
            alt: friend.nickname,
          }
        );
        friendProfile.render();

        if (onlineStatus[friend.userId]) {
          const onlineIcon = new OnlineIcon(
            this.$target.querySelector(`#online-icon-${friend.userId}`)
          );
          onlineIcon.render();
        }
      });
    }
  }
}
