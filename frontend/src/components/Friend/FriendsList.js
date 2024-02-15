import Component from "../../core/Component.js";

function sendMessage(userId) {
  console.log(`Sending message to ${userId}`);
  // 메시지 보내기 로직 구현
}

function visitProfile(userId) {
  console.log(`Visiting profile of ${userId}`);
  // 프로필 페이지 방문 로직 구현
}

function requestPvP(userId) {
  console.log(`Requesting 1 vs 1 game with ${userId}`);
  // 게임 요청 로직 구현
}

function blockFriend(userId) {
  console.log(`Blocking ${userId}`);
  // 친구 차단 API 호출 로직 구현
}

export default class FriendsList extends Component {
  template() {
    const { friends } = this.props;
    return `
      <div
        class="list-group list-group-flush"
      >
        ${friends.map(
          (friend) => `
            <div
              class="dropdown dropend"
            >
              <div
                class="
                  list-group-item
                  list-group-item-action
                  d-flex
                  align-items-center
                  dropdown-toggle
                "
                type="button"
                data-bs-toggle="dropdown"
                style="min-width: 20rem;"
              >
                <div
                  class="overflow-hidden rounded-circle"
                  style="width: 4rem; height: 4rem;"
                >
                  <img
                    src=${friend.profile_image}
                    class="img-fluid"
                    alt="default"
                  >
                </div>
                <span
                  class="mx-3"
                >
                  <h5 class="fw-bold mb-1">${friend.nickname}</h5>
                  <small class="g-light-grey">click here to send message</small>
                </span>
              </div>
              <ul class="dropdown-menu" data-friend-id="${friend.user_id}">
                <li><button class="dropdown-item">DM</button></li>
                <li><button class="dropdown-item">Profile</button></li>
                <li><button class="dropdown-item">1 vs 1</button></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item text-danger">Block</button></li>
              </ul>
            </div>
          `
        )}
      </div>
    `;
  }

  setEvent() {
    this.$target.addEventListener("click", (event) => {
      const { target } = event;
      if (target.classList.contains("dropdown-item")) {
        const action = target.textContent;
        const userId = target.closest(".dropdown-menu").dataset.friendId;

        switch (action) {
          case "DM":
            sendMessage(userId);
            break;
          case "Profile":
            visitProfile(userId);
            break;
          case "1 vs 1":
            requestPvP(userId);
            break;
          case "Block":
            blockFriend(userId);
            break;
          default:
            console.log("Unknown action");
        }
      }
    });
  }
}
import Component from "../../core/Component.js";

export default class FriendsList extends Component {
  template() {
    const { friends } = this.props;
    return `
      <div
        class="list-group list-group-flush"
      >
        ${friends.map(
          (friend) => `
            <div
              id="chat-trigger"
              data-friend-${friend.user_id}
              class="list-group-item d-flex align-items-center"
              style="min-width: 20rem;"
            >
              <div
                class="overflow-hidden rounded-circle"
                style="width: 4rem; height: 4rem;"
              >
                <img
                  src=${friend.profile_image}
                  class="img-fluid"
                  alt="default"
                >
              </div>
              <span
                class="mx-3"
              >
                <h5 class="mb-1">${friend.nickname}</h5>
                <small class="g-light-grey">click here to send message</small>
              </span>
            </div>
          `
        )}
      </div>
    `;
  }
}
