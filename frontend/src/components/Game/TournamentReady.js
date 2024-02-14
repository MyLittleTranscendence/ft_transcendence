import Component from "../../core/Component.js";
import PageContainerWithLogo from "../UI/Container/PageContainerWithLogo.js";
import PlayerOverviews from "./PlayerOverviews.js";

export default class TournamentReady extends Component {
  template() {
    return `
      <div id="tournament-ready-content" class="d-flex flex-column align-items-center">
        <h1 class="text-white fw-bold">Tournament</h1>
        <h3 class="text-white fw-bold">Round of 4</h3>
        <div id="overviews-container" class="d-flex"></div>
      </div>
    `;
  }

  mounted() {
    const $content = this.$target.querySelector("#tournament-ready-content");
    const $overviewsContainer = $content.querySelector("#overviews-container");
    const pageContainer = new PageContainerWithLogo(this.$target, $content);

    pageContainer.render();

    const { player1, player2, player3, player4 } = this.props;

    const playerOverviews1 = new PlayerOverviews($overviewsContainer, {
      player1,
      player2,
      type: "tournament",
      matchOrder: 1,
    });
    const playerOverviews2 = new PlayerOverviews($overviewsContainer, {
      player1: player3,
      player2: player4,
      type: "tournament",
      matchOrder: 2,
    });

    playerOverviews1.render();
    playerOverviews2.render();
  }
}
