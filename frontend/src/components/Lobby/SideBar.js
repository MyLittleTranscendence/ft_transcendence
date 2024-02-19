import Component from "../../core/Component.js";
import FriendsIcon from "../UI/Icon/FriendsIcon.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import { myInfoStore } from "../../store/initialStates.js";

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
        class="position-relative d-flex justify-content-center"
      ></div>
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

    myProfile.render();
    friendsIcon.render();
  }
}
