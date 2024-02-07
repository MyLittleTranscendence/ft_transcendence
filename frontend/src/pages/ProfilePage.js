import Component from "../core/Component.js";
import PageContainerWithLogo from "../components/UI/Container/PageContainerWithLogo.js";
import Profile from "../components/Profile/Profile.js";
import MatchHistoryCard from "../components/Profile/MatchHistoryCard.js";
import fetchAPI from "../utils/fetch/fetchAPI.js";

export default class ProfilePage extends Component {
  template() {
    return `
      <div
        id="profile-container"
        class="d-flex flex-column align-items-center"
      >
        <div
          id="profile-content"
        >
        </div>
        <div
          id="match-history-content"
        </div>
      </div>
    `;
  }

  mounted() {
    const $profileContainer = this.$target.querySelector("#profile-container");

    const pageContainer = new PageContainerWithLogo(
      this.$target,
      $profileContainer
    );
    const profileContent = new Profile($profileContainer, {
      username: "hyeonjun",
      imageSize: "image-mid",
      imageSrc: "asset/default.png",
      alt: "my profile",
      wins: 42,
      losses: 42,
    });
    const matchHistoryContent = new MatchHistoryCard($profileContainer, {
      matchtype: "1 vs 1",
      win: false,
      username: "hyeonjun",
      opponent: "fet-asx-bita500",
      score: "0:2",
    });

    pageContainer.render();
    profileContent.render();
    matchHistoryContent.render();
  }
}
