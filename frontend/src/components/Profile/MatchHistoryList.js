import Component from "../../core/Component.js";
import MatchHistoryCard from "./MatchHistoryCard.js";
import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";

export default class MatchHistoryList extends Component {
  setup() {
    this.state = { gameList: [], isLoading: true };
    fetchAPI
      .get(`/games/?user_id=${this.props.userId}`)
      .then((data) =>
        this.setState({ gameList: data.results, isLoading: false })
      )
      .catch((e) => {
        if (e.status === 401) {
          const { navigate } = getRouter();
          navigate("/start");
        }
      });
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
      <ul id="game-info-list" class="px-0 d-flex flex-column align-items-center" style="list-style-type: none;">
        ${gameList.map((gameInfo) => `<li id="game-info-${gameInfo.id}" class="my-2"></li>`).join("")}
      </ul>
`;
  }

  mounted() {
    const { gameList } = this.state;

    if (gameList.length === 0) {
      return;
    }

    const $gameInfoList = this.$target.querySelector("#game-info-list");

    if (gameList.length > 0) {
      gameList.forEach((gameInfo) => {
        const matchHistoryCard = new MatchHistoryCard(
          $gameInfoList.querySelector(`#game-info-${gameInfo.id}`),
          { ...gameInfo, isWin: gameInfo.winner.id === this.props.userId }
        );
        matchHistoryCard.render();
      });
    }
  }
}
