import Component from "../../core/Component.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import Friend from "../Friend/Friend.js";
import { myInfoStore } from "../../store/initialStates.js";

export default class SideBar extends Component {
  setup() {
    myInfoStore.subscribe(this);
  }

  template() {
    return `
      <div id="sidebar-my-profile-image-holder"></div>
      <div id="sidebar-friend-content"></div>
    `;
  }

  mounted() {
    const myProfile = new ProfileImage(
      this.$target.querySelector("#sidebar-my-profile-image-holder"),
      {
        userId: myInfoStore.getState().userId,
        imageSize: "image-sm",
        imageSrc: myInfoStore.getState().profileImage,
        alt: "my profile",
      }
    );
    const friend = new Friend(
      this.$target.querySelector("#sidebar-friend-content"),
      {},
      this
    );

    myProfile.render();
    friend.render();
  }
}
