import Component from "../../core/Component.js";
import FriendsIcon from "../UI/Icon/FriendsIcon.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import { myInfoStore } from "../../store/initialStates.js";
import FriendsList from "../Friend/FriendsList.js";
import BlockList from "../Friend/BlockList.js";
import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";

function sendMessage(userId) {
  console.log(`Sending message to ${userId}`);
  // 메시지 보내기 로직 구현
}

function requestPvP(userId) {
  console.log(`Requesting 1 vs 1 game with ${userId}`);
  // 게임 요청 로직 구현
}

function blockFriend(userId, friendId) {
  console.log(`Blocking ${userId}`);
  fetchAPI
    .post(`/users/${userId}/blocks/`)
    .then(() => showToast(`Block Success`))
    .catch(() => showToast("error fetching block friend"));
  fetchAPI
    .delete(`/users/${userId}/friends/${friendId}/`)
    .catch(() => showToast("error fetching delete friend"));
}

function unblockUser(userId, blockId) {
  console.log(`Unblocking ${userId}`);
  fetchAPI
    .delete(`/users/${userId}/blocks/${blockId}/`)
    .then(() => showToast(`Unblock Success`))
    .catch(() => showToast("error fetching unblock friend"));
  fetchAPI
    .post(`/users/${userId}/friends/`)
    .catch(() => showToast("error fetching delete friend"));
}

export default class SideBar extends Component {
  setup() {
    const unsubscribe = myInfoStore.subscribe(this);
    this.removeObservers.push(unsubscribe);
  }

  template() {
    return `
      <a 
        id="sidebar-my-profile-link"
        href="/profile?user_id=${myInfoStore.getState().userId}"
        data-link
      ></a>
      <div
        id="friends-icon-holder"
        type="button"
        class="
          position-relative
          d-flex justify-content-center
        "
        data-bs-toggle="modal"
        data-bs-target="#friends-list-modal"
      >
      </div>
      <div id="friends-list-modal" class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Friends</h4>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
              <div id="friends-list-holder" class="modal-body"></div>
              <div class="modal-footer">
                <button class="btn" data-bs-target="#block-list-modal" data-bs-toggle="modal">Block</button>
              </div>
          </div>
        </div>
      </div>

      <div id="block-list-modal" class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Block</h4>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div id="block-list-holder" class="modal-body"></div>
            <div class="modal-footer">
              <button class="btn" data-bs-target="#friends-list-modal" data-bs-toggle="modal">Back</button>
            </div>
          </div>
        </div>
      </div>

      <div id="dm-modal" class="modal fade"></div>
    `;
  }

  mounted() {
    const myProfile = new ProfileImage(
      this.$target.querySelector("#sidebar-my-profile-link"),
      {
        imageSize: "image-sm",
        imageSrc: myInfoStore.getState().profileImage,
        alt: "my profile",
      }
    );
    const friendsIcon = new FriendsIcon(
      this.$target.querySelector("#friends-icon-holder"),
      { isOnline: true }
    );
    const friendsList = new FriendsList(
      this.$target.querySelector("#friends-list-holder")
    );
    const blockList = new BlockList(
      this.$target.querySelector("#block-list-holder")
    );
    friendsList.render();
    blockList.render();
    myProfile.render();
    friendsIcon.render();
  }

  setEvent() {
    document.addEventListener("click", (event) => {
      const { target } = event;
      if (target.classList.contains("dropdown-item")) {
        const action = target.textContent;
        const { userId } = target.closest(".dropdown-menu").dataset;
        const { subId } = target.closest(".dropdown-menu").dataset;

        switch (action) {
          case "DM":
            console.log(target.dataset);
            break;
          case "Profile":
            break;
          case "1 vs 1":
            requestPvP(userId);
            break;
          case "Block":
            blockFriend(userId, subId);
            break;
          case "Unblock":
            unblockUser(userId, subId);
            break;
          default:
            console.log("Unknown action");
        }
      }
    });
  }
}
