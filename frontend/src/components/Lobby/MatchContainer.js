import Component from "../../core/Component.js";
import appendCSSLink from "../../utils/appendCSSLink.js";
import BouncingBallOnRacket from "../UI/BouncingBallOnRacket.js";
import Button from "../UI/Button/Button.js";
import MatchTypeDropdown from "./MatchTypeDropdown.js";
import showToast from "../../utils/showToast.js";
import { invitationFailHandler } from "../../handlers/game/inviteUserHandler.js";
import {
  matchFindHandler,
  cancleMatchFindHandler,
  queueParticipantCountUpdateHandler,
  matchFoundHandler,
  joinMatchHandler,
  fallbackToMatchFindHandler,
  penaltyWaitHandler,
  matchSuccessHandler,
  createSingleGameHandler,
  getGameInfoHandler,
  tournamentBeginHandler,
  receiveGameInviteHandler,
} from "../../handlers/game/matchMakingHandlers.js";
import { gameSocket } from "../../socket/socket.js";
import receiveLogoutHandler from "../../handlers/auth/socketLogoutHandler.js";

appendCSSLink("src/components/Lobby/TimeLeftBar.css");

export default class MatchContainer extends Component {
  setup() {
    this.state = {
      matchType: "Choose Match Type",
      isChosen: false,
      isFindingMatch: false,
      isMatchFound: false,
      isJoined: false,
      matchSessionId: "",
      isPenalty: false,
    };
  }

  setEvent() {
    this.addEvent("click", ".match-type-dropdown-li", (e) => {
      if (e.target.textContent !== this.state.matchType) {
        this.setState({ matchType: e.target.textContent, isChosen: true });
        if (e.target.textContent === "Single Play") {
          createSingleGameHandler();
        }
      }
    });
    this.addEvent("click", "#find-match-btn", () => {
      if (this.state.isFindingMatch === false) {
        matchFindHandler(this.state.matchType);
      } else {
        cancleMatchFindHandler(this.state.matchType);
      }
      this.setState({ isFindingMatch: !this.state.isFindingMatch });
    });
    this.addEvent("click", "#cancle-match-btn", () => {
      this.initSetState();
      showToast("Opps, There will be a penalty for canceling.");
    });
    this.addEvent("click", "#join-match-btn", () => {
      joinMatchHandler(this.state.matchSessionId);
      this.setState({ isJoined: true });
    });

    queueParticipantCountUpdateHandler(this.$target, this.removeObservers);
    matchFoundHandler((state) => this.setState(state), this.removeObservers);
    fallbackToMatchFindHandler(
      (state) => this.setState(state),
      this.removeObservers
    );
    penaltyWaitHandler((state) => this.setState(state), this.removeObservers);
    matchSuccessHandler(this.removeObservers);
    getGameInfoHandler(this.removeObservers);
    tournamentBeginHandler(this.removeObservers);
    receiveGameInviteHandler(this.removeObservers);
    invitationFailHandler(this.removeObservers);
    receiveLogoutHandler(this.removeObservers, gameSocket);
  }

  template() {
    const {
      matchType,
      isChosen,
      isFindingMatch,
      isMatchFound,
      isJoined,
      isPenalty,
    } = this.state;

    const title = `<h3 class="position-absolute top-0 start-50 translate-middle ps-3 pe-3 bg-primary text-white">Match</h3>`;

    if (isPenalty) {
      return `${title}
        <div class="w-100 h-100 d-flex flex-column align-items-center justify-content-center">
          <h6 class="text-warning fw-bold">You have penalty wait.</h6>
          <h1 id="wait-counter" class="fw-bold text-white"></h1>
        </div>
      `;
    }

    return `${title}
      <div id="match-type-dropdown" class="dropdown-center mb-5"></div>
      <div class="position-absolute d-flex flex-column align-items-center" style="top: 10rem;">
        ${
          isMatchFound
            ? `
              ${
                !isJoined
                  ? `<text class="text-white fw-bold fs-4">Match Found!</text>
                    <div class="time-left-bar-container">
                      <div class="time-left-bar"></div>
                    </div>`
                  : `<text class="text-white fw-bold fs-4">Joining match...</text>`
              }
              <div class="d-flex align-items-center mt-3">
                <div id="join-btn-holder" class="me-3"></div>
                <div id="cancle-btn-holder"></div>
              </div>
              `
            : `
              ${isChosen ? `<div id="find-match-btn-holder" class="mb-4"></div>` : ""}
              ${!isChosen ? `<h3 class="text-white fw-bold">Play Now!</h3>` : ""}
              ${
                isFindingMatch
                  ? `<text class="text-white fs-5 fw-bold">Looking for a match...</text>
                    ${
                      matchType !== "Single Play"
                        ? `<text class="text-white fs-5 fw-bold">
                        <span id="participant-count">1</span>
                        / ${matchType === "1 vs 1" ? "2" : "4"}
                      </text>`
                        : ""
                    }`
                  : ""
              }
            `
        }
      </div>
      <div id="ball-racket-holder"></div>
    `;
  }

  mounted() {
    const { isChosen, isFindingMatch, isMatchFound, isJoined, isPenalty } =
      this.state;

    if (isPenalty) {
      this.startPenaltyCountdown(
        this.state.waitTime,
        this.$target.querySelector("#wait-counter")
      );
      return;
    }

    const matchTypeDropdown = new MatchTypeDropdown(
      this.$target.querySelector("#match-type-dropdown"),
      {
        matchType: this.state.matchType,
        isFindingMatch,
        isMatchFound,
      }
    );
    matchTypeDropdown.render();

    if (isChosen && !isMatchFound) {
      const findMatchButton = new Button(
        this.$target.querySelector("#find-match-btn-holder"),
        {
          id: "find-match-btn",
          content: isFindingMatch ? "Cancle" : "Find a match",
          className: isFindingMatch ? "cancle-button" : "",
        }
      );
      findMatchButton.render();
    }

    if (isMatchFound) {
      const joinMatchButton = new Button(
        this.$target.querySelector("#join-btn-holder"),
        {
          id: "join-match-btn",
          content: "Join",
          disabled: isJoined,
        }
      );
      const cancleMatchButton = new Button(
        this.$target.querySelector("#cancle-btn-holder"),
        {
          id: "cancle-match-btn",
          content: "Cancle",
          className: "cancle-button",
          disabled: isJoined,
        }
      );
      joinMatchButton.render();
      cancleMatchButton.render();
    }

    const bouncingBallOnRacket = new BouncingBallOnRacket(
      this.$target.querySelector("#ball-racket-holder"),
      {
        findingMatch: isFindingMatch,
      }
    );
    bouncingBallOnRacket.render();
  }

  initSetState() {
    this.setState({
      matchType: "Choose Match Type",
      isChosen: false,
      isFindingMatch: false,
      isMatchFound: false,
      isJoined: false,
      matchSessionId: "",
      isPenalty: false,
    });
  }

  startPenaltyCountdown(waitTime, counterElement) {
    let countdown = Math.floor(waitTime / 1000);
    const $counter = counterElement;

    const intervalId = setInterval(() => {
      $counter.textContent = countdown;
      countdown -= 1;

      if (countdown < 0) {
        clearInterval(intervalId);
        this.initSetState();
      }
    }, 1000);
  }
}
