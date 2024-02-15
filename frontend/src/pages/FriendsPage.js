import Component from "../core/Component.js";
import PageContainerWithLogo from "../components/UI/Container/PageContainerWithLogo.js";
import FriendsList from "../components/Friend/FriendsList.js";

export default class FriendsPage extends Component {
  template() {
    return `
      <div
        id="friends-page-container"
        class="d-flex flex-column align-items-center"
      >
        <div
          id="friends-list-container"
        >
        </div>
      </div>
    `;
  }

  mounted() {
    const $friendsPageContainer = this.$target.querySelector(
      "#friends-page-container"
    );

    const pageContainer = new PageContainerWithLogo(
      this.$target,
      $friendsPageContainer
    );
    const friendList = new FriendsList(
      this.$target.querySelector("#friends-list-container"),
      {
        friends: [
          {
            user_id: "1",
            profile_image: "asset/default.png",
            nickname: "JincPark",
          },
          {
            user_id: "2",
            profile_image: "asset/default.png",
            nickname: "Sechung",
          },
        ],
      }
    );
    // fetchAPI.get("/friends/")
    //   .then((data) => {
    //     new friendsList = new FriendsList(
    //     this.$target.querySelector("#friends-list-container"));
    //   })
    //   .catch(() => showToast("error fetching friends list"));
    pageContainer.render();
    friendList.render();
  }
}
