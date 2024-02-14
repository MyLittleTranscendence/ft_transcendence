import Component from "../../core/Component.js";
import PageContainerWithLogo from "../UI/Container/PageContainerWithLogo.js";
import PlayerOverviews from "./PlayerOverviews.js";

export default class PvPReady extends Component {
  template() {
    return `
      <div id="pvp-ready-content" class="d-flex flex-column align-items-center">
        <h1 class="text-white fw-bold">1 vs 1</h1>
      </div>
    `;
  }

  mounted() {
    const pageContainer = new PageContainerWithLogo(
      this.$target,
      this.$target.querySelector("#pvp-ready-content")
    );

    pageContainer.render();

    const playerOverviews = new PlayerOverviews(
      this.$target.querySelector("#pvp-ready-content"),
      {
        player1: this.props.player1,
        player2: this.props.player2,
      }
    );

    playerOverviews.render();
  }
}
