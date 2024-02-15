import Component from "../../core/Component.js";
import appendCSSLink from "../../utils/appendCSSLink.js";
import BouncingBallOnRacket from "../UI/BouncingBallOnRacket.js";
import Button from "../UI/Button/Button.js";
import MatchTypeDropdown from "./MatchTypeDropdown.js";

appendCSSLink("src/components/Lobby/TimeLeftBar.css");

export default class MatchContainer extends Component {
  setup() {
    this.state = {
      matchType: "Choose Match Type",
      isChosen: false,
      isFindingMatch: false,
      isMatchFound: true,
    };
  }

  setEvent() {
    this.addEvent("click", ".match-type-dropdown-li", (e) => {
      if (e.target.textContent !== this.state.matchType) {
        this.setState({ matchType: e.target.textContent, isChosen: true });
      }
    });
    this.addEvent("click", "#find-match-btn", () => {
      this.setState({ isFindingMatch: !this.state.isFindingMatch });
    });
    this.addEvent("click", "#cancle-match-btn", () => {
      this.setState({ isMatchFound: false });
    });
    // 매치 찾았을 때 isFoundMatch: true 로 setState 및
    // 10초 타임아웃으로 setState isFoundMatch: false
  }

  template() {
    const { isChosen, isFindingMatch, isMatchFound } = this.state;

    return `
      <h3
        class="
          position-absolute
          top-0 start-50
          translate-middle
          ps-3 pe-3
          bg-primary
          text-white"
        >
          Match
      </h2>
      <div id="match-type-dropdown" class="dropdown-center mb-5"></div>
      <div class="position-absolute d-flex flex-column align-items-center" style="top: 10rem;">
        ${
          isMatchFound
            ? `
              <text class="text-white fw-bold fs-4">Match Found!</text>
              <div class="time-left-bar-container">
                <div class="time-left-bar"></div>
              </div>
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
                    <text class="text-white fs-5 fw-bold"><span id="participant-count">1</span> / 4</text>`
                  : ""
              }
            `
        }
      </div>
      <div id="ball-racket-holder"></div>
    `;
  }

  mounted() {
    const { matchType, isChosen, isFindingMatch, isMatchFound } = this.state;

    const matchTypeDropdown = new MatchTypeDropdown(
      this.$target.querySelector("#match-type-dropdown"),
      {
        matchType: this.state.matchType,
        isFindingMatch,
      }
    );
    matchTypeDropdown.render();

    if (isChosen) {
      const findMatchButton = new Button(
        this.$target.querySelector("#find-match-btn-holder"),
        {
          id: "find-match-btn",
          content: isFindingMatch ? "Cancle" : "Find a match",
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
        }
      );
      const cancleMatchButton = new Button(
        this.$target.querySelector("#cancle-btn-holder"),
        {
          id: "cancle-match-btn",
          content: "Cancle",
          className: "cancle-button",
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
}
