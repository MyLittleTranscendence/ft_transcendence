import PongGame from "../components/Game/PongGame.js";
import PvPReady from "../components/Game/PvPReady.js";
import Component from "../core/Component.js";

export default class PvPGamePage extends Component {
  mounted() {
    const player1 = {
      id: 1,
      nickname: "jincpark",
      wins: 13,
      losses: 199,
    };
    const player2 = {
      id: 2,
      nickname: "hehe",
      wins: 100,
      losses: 0,
    };

    const pvpReady = new PvPReady(this.$target, {
      player1,
      player2,
    });
    pvpReady.render();

    setTimeout(() => {
      const pongGame = new PongGame(this.$target, {
        currentMatch: { player1, player2 },
        type: "pvp",
      });
      this.$target.innerHTML = "";
      pongGame.render();
    }, 1000);
  }
}
