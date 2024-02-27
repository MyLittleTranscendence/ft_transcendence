import Component from "../core/Component.js";
import PageContainerWithLogo from "../components/UI/Container/PageContainerWithLogo.js";
import Profile from "../components/Profile/Profile.js";
import Settings from "../components/Profile/Settings.js";
import MatchHistoryList from "../components/Profile/MatchHistoryList.js";
import { myInfoStore } from "../store/initialStates.js";

export default class ProfilePage extends Component {
  template() {
    return `
      <div
        id="profile-container"
        class="d-flex flex-column align-items-center"
      >
        <div id="profile-content">
        </div>
        <br><br>
        <div
          id="settings-content"
          class="d-flex flex-column align-items-center"
        ></div>
        <br><br>
        <div id="match-history-content" class="d-flex flex-column align-items-center"></div>
      </div>
    `;
  }

  mounted() {
    const searchParams = new URLSearchParams(window.location.search);
    const userId = parseInt(searchParams.get("user_id"), 10);
    const isMe = userId === myInfoStore.getState().userId;

    const $profileContainer = this.$target.querySelector("#profile-container");

    const pageContainer = new PageContainerWithLogo(
      this.$target,
      $profileContainer
    );

    const profileContent = new Profile(
      $profileContainer.querySelector("#profile-content"),
      {
        userId,
        isMe,
      },
      this
    );

    if (isMe) {
      const settings = new Settings(
        $profileContainer.querySelector("#settings-content"),
        {},
        this
      );
      settings.render();
    }

    const matchHistoryContent = new MatchHistoryList(
      $profileContainer.querySelector("#match-history-content"),
      { userId }
    );

    pageContainer.render();
    profileContent.render();
    matchHistoryContent.render();
  }
}
