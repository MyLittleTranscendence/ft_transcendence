import Component from "../core/Component.js";
import PageContainerWithLogo from "../components/UI/Container/PageContainerWithLogo.js";
import PlayerOverviews from "../components/Game/PlayerOverviews.js";
import { gameInfoStore } from "../store/initialStates.js";
import { gameSocket } from "../socket/socketManager.js";
import getRouter from "../core/router.js";

export default class PvPReadyPage extends Component {
  setEvent() {}

  template() {
    return `
      <div id="pvp-ready-content" class="d-flex flex-column align-items-center">
        <h1 class="text-white fw-bold">1 vs 1</h1>
        <div id="player-overviews-holder"></div>
      </div>
    `;
  }

  mounted() {
    const pageContainer = new PageContainerWithLogo(
      this.$target,
      this.$target.querySelector("#pvp-ready-content")
    );

    pageContainer.render();

    const { leftUserId, rightUserId } = gameInfoStore.getState();

    const playerOverviews = new PlayerOverviews(
      this.$target.querySelector("#player-overviews-holder"),
      {
        leftUserId,
        rightUserId,
      }
    );

    playerOverviews.render();

    const { addSocketObserver } = gameSocket();
    const removeObserver = addSocketObserver("wait_game", (message) => {
      const { navigateWithoutPushState } = getRouter();
      if (message.time < 4) {
        navigateWithoutPushState("/game");
      }
    });
    this.removeObservers.push(removeObserver);
  }
}
