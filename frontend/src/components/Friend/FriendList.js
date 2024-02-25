import Component from "../../core/Component.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import { friendListStore } from "../../store/initialStates.js";

export default class FriendList extends Component {
  setup() {
    const unsubscribe = friendListStore.subscribe(this);
    this.removeObservers.push(unsubscribe);
  }

  template() {
    const friends = friendListStore.getState().friends;

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
                <div id="friend-profile-${friend.user_id}"></div>
                <span class="mx-3">
                  <h5 class="fw-bold mb-1">${friend.nickname}</h5>
                  <small class="g-light-grey">click here to send message</small>
                </span>
              </div>
              <ul class="dropdown-menu" data-user-id="${friend.user_id}">
                <li>
                  <button
                    id="dm-toggle"
                    class="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#direct-message-modal"
                    data-dm-id="${friend.user_id}"
                  >
                    DM
                  </button>
                </li>
                <li><a
                  href="/profile?user_id=${friend.user_id}"
                  class="dropdown-item"
                  data-bs-dismiss="modal"
                  data-link
                  >
                    Profile
                </a></li>
                <li><button class="dropdown-item">1 vs 1</button></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item text-danger">Block</button></li>
              </ul>
            </div>
          `
          )
          .join("")}
      </div>
    `;
  }

  mounted() {
    const friends = friendListStore.getState().friends;

    if (friends.length > 0) {
      friends.forEach((friend) => {
        const friendProfile = new ProfileImage(
          this.$target.querySelector(`#friend-profile-${friend.user_id}`),
          {
            userId: friend.user_id,
            imageSrc: friend.profile_image,
            imageSize: "image-sm",
            alt: "/asset/default.png",
          }
        );
        friendProfile.render();
      });
    }
  }
}
