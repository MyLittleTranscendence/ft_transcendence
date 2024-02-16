import Component from "../../core/Component.js";
import FriendsIcon from "../UI/Icon/FriendsIcon.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import { myInfoStore } from "../../store/initialStates.js";

export default class SideBar extends Component {
  setup() {
    const unsubscribeStore = myInfoStore.subscribe(this);
    this.removeObservers.push(unsubscribeStore);
  }

  template() {
    return `
      <a 
        id="sidebar-my-profile-link"
        href="/my-page"
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
        imageSrc: myInfoStore.getState().profile_image,
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
