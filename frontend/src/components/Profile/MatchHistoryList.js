import Component from "../../core/Component.js";
import MatchHistoryCard from "./MatchHistoryCard.js";
import fetchAPI from "../../utils/fetchAPI.js";

export default class MatchmatchInfoList extends Component {
  setup() {
    this.state = { gameList: [], isLoading: true, page: 1 };
    // fetchAPI
    //   .get(`/games/?page=${this.state.page}&user_id=${this.props.userId}`)
    //   .then((data) =>
    //     this.setState({ gameList: data.results, isLoading: false })
    //   );
  }

  template() {
    const { gameList, isLoading } = this.state;

    const title = `<h3 class="text-white fw-bold">Match History</h3>`;

    if (isLoading) {
      return `
        ${title}
        <br>
        <div class="d-flex justify-content-center">
          <div class="spinner-border text-light" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      `;
    }

    if (gameList.length === 0) {
      return `
        ${title}
        <br>
        <div class="d-flex justify-content-center">
          <h4 class="fw-bold g-light-grey">No match found yet.</h4>
        </div>
      `;
    }

    return `
      ${title}
      <ul id="game-info-list">
        ${gameList.map((gameInfo) => `<li id="game-info-${gameInfo.id}"></li>`)}
      </ul>
    `;
  }

  mounted() {
    const { gameList } = this.state;

    if (gameList.length === 0) {
      return;
    }

    const $gameInfoList = this.$target.querySelector("#game-info-list");

    gameList.array.forEach((gameInfo) => {
      const matchHistoryCard = new MatchHistoryCard(
        $gameInfoList.querySelector(`#game-info-${gameInfo.id}`),
        { ...gameInfo, isWin: gameInfo.winner.id === this.props.userId }
      );
      matchHistoryCard.render();
    });
  }
}
