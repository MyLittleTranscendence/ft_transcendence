import Component from "../../core/Component.js";
import FriendsIcon from "../UI/Icon/FriendsIcon.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";

export default class SideBar extends Component {
  template() {
    return `
      <div
        class="
          col col-lg-2
          d-flex flex-column align-items-center
          ms-4 gap-3
        "
        style="max-width: 4rem;"
      >
        <a 
          id="sidebar-my-profile-link"
          href="/my-page"
        ></a>
        <div
          id="friends-icon-holder"
          class="
            position-relative
            d-flex justify-content-center
          "
        >
        </div>
      </div>
    `;
  }

  mounted() {
    const myProfile = new ProfileImage(
      this.$target.querySelector("#sidebar-my-profile-link"),
      {
        imageSize: "image-sm",
        imageSrc: "asset/default.png",
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
