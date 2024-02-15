import Component from "../../core/Component.js";
import PlayerOverview from "./PlayerOverview.js";

export default class PlayerOverviews extends Component {
  template() {
    const { type, matchOrder } = this.props;
    return `
      <div class="d-flex flex-column align-items-center m-4 text-white">
        ${type === "tournament" ? `<h4>${matchOrder}st match</h4>` : ""}
        <div 
          id="player-${matchOrder}-overview-container"
          class="d-flex align-items-center"
        >
          <div id="player-${matchOrder}-1-overview"></div>
          <h2 class="text-white fw-bold mx-3">vs</h2>
          <div id="player-${matchOrder}-2-overview"></div>
        </div>
      </div>
    `;
  }

  mounted() {
    const { matchOrder, player1, player2 } = this.props;
    const $container = this.$target.querySelector(
      `#player-${matchOrder}-overview-container`
    );

    const player1Overview = new PlayerOverview(
      $container.querySelector(`#player-${matchOrder}-1-overview`),
      player1
    );
    const player2Overview = new PlayerOverview(
      $container.querySelector(`#player-${matchOrder}-2-overview`),
      player2
    );

    player1Overview.render();
    player2Overview.render();
  }
}
