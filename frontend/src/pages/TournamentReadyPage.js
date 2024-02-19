import Component from "../core/Component.js";
import PageContainerWithLogo from "../components/UI/Container/PageContainerWithLogo.js";
import PlayerOverviews from "../components/Game/PlayerOverviews.js";

export default class TournamentReadyPage extends Component {
  template() {
    return `
      <div id="tournament-ready-content" class="d-flex flex-column align-items-center">
        <h1 class="text-white fw-bold">Tournament</h1>
        <h3 class="text-white fw-bold">Round of 4</h3>
        <div id="overviews-container" class="d-flex">
          <div id="first-match-overview"></div>
          <div id="second-match-overview"></div>
        </div>
      </div>
    `;
  }

  mounted() {
    const $content = this.$target.querySelector("#tournament-ready-content");
    const $overviewsContainer = $content.querySelector("#overviews-container");
    const pageContainer = new PageContainerWithLogo(this.$target, $content);

    pageContainer.render();

    const { leftUser, rightUser, player3, player4 } = this.props;

    const playerOverviews1 = new PlayerOverviews(
      $overviewsContainer.querySelector("#first-match-overview"),
      {
        leftUser,
        rightUser,
        type: "tournament",
        matchOrder: 1,
      }
    );
    const playerOverviews2 = new PlayerOverviews(
      $overviewsContainer.querySelector("#second-match-overview"),
      {
        leftUser: player3,
        rightUser: player4,
        type: "tournament",
        matchOrder: 2,
      }
    );

    playerOverviews1.render();
    playerOverviews2.render();
  }
}
