import Component from "../../core/Component.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import Friend from "../Friend/Friend.js";
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
      <div id="sidebar-friend-content"></div>
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
    const friend = new Friend(
      this.$target.querySelector("#sidebar-friend-content")
    );

    myProfile.render();
    friend.render();
  }
}
