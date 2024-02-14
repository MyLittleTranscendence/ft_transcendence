import Component from "../../core/Component.js";
import PlayerOverview from "./PlayerOverview.js";

export default class PlayerOverviews extends Component {
  template() {
    const { type, matchOrder } = this.props;
    return `
      <div class="d-flex flex-column align-items-center m-4 text-white">
        ${type === "tournament" ? `<h4>${matchOrder}st match</h4>` : ""}
        <div
          id="player-overview-container-${matchOrder}"
          class="d-flex align-items-center"
        ></div>
      </div>
    `;
  }

  mounted() {
    const { matchOrder, player1, player2 } = this.props;
    const $container = this.$target.querySelector(
      `#player-overview-container-${matchOrder}`
    );
    const player1Overview = new PlayerOverview($container, player1);
    const player2Overview = new PlayerOverview($container, player2);

    player1Overview.render();

    const $h2 = document.createElement("h2");
    $h2.className = "text-white fw-bold mx-3";
    $h2.textContent = "vs";
    $container.appendChild($h2);

    player2Overview.render();
  }
}
