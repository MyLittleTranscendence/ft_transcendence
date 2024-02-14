import Component from "../core/Component.js";
import TournamentReady from "../components/Game/TournamentReady.js";
import PongGame from "../components/Game/PongGame.js";

export default class TournamentGamePage extends Component {
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
    const player3 = {
      id: 3,
      nickname: "man",
      wins: 100,
      losses: 10389,
    };
    const player4 = {
      id: 4,
      nickname: "chicken",
      wins: 2398,
      losses: 0,
    };

    const tournamentReady = new TournamentReady(this.$target, {
      player1,
      player2,
      player3,
      player4,
    });
    tournamentReady.render();

    setTimeout(() => {
      const currentMatch = {
        player1,
        player2,
      };
      const nextMatch = {
        player1: player3,
        player2: player4,
      };
      const pongGame = new PongGame(this.$target, {
        currentMatch,
        nextMatch,
        type: "tournament",
      });
      this.$target.innerHTML = "";
      pongGame.render();
    }, 1000);
  }
}
