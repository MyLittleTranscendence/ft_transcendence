import Component from "../../core/Component.js";
import FriendsIcon from "../UI/Icon/FriendsIcon.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import { myInfoStore } from "../../store/initialStates.js";
import getFriendsList from "../Friend/FriendsList.js";

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
      <a
        tabindex="0"
        data-bs-toggle="popover"
        id="friends-list-trigger"
        class="
          position-relative
          d-flex justify-content-center
        "
      >
      </a>
      <div
        class="modal fade"
        id="dm-modal"
        tabindex="-1"
        aria-labelledby="dm-modal-label"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="dm-modal-label">DM</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Chatting comming soon!
            </div>
          </div>
        </div>
      </div>
    `;
  }

  setEvent() {}

  mounted() {
    const popover = new bootstrap.Popover(
      this.$target.querySelector(`[data-bs-toggle="popover"]`),
      {
        html: true,
        title: "Friends",
        content: getFriendsList(),
      }
    );
    const modal = new bootstrap.Modal(document.getElementById("dm-modal"));
    const myProfile = new ProfileImage(
      this.$target.querySelector("#sidebar-my-profile-link"),
      {
        imageSize: "image-sm",
        imageSrc: myInfoStore.getState().profileImage,
        alt: "my profile",
      }
    );
    const friendsIcon = new FriendsIcon(
      this.$target.querySelector("#friends-list-trigger"),
      { isOnline: true }
    );
    myProfile.render();
    friendsIcon.render();
  }
}
