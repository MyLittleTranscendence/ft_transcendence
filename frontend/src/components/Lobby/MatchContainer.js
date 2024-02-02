import Component from "../../core/Component.js";
import BouncingBallOnRacket from "../UI/BouncingBallOnRacket.js";
import MatchTypeDropdown from "./MatchTypeDropdown.js";

export default class MatchContainer extends Component {
  template() {
    return `
      <div
        id="match-container"
        class="
          col-md-auto
          d-flex
          flex-column
          align-items-center
          justify-content-between
          p-5 me-4
          border border-white border-5
          position-relative"
        style="min-height: 30rem;"
      >
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
        <h3 class="text-white fw-bold">Play Now!</h3>
      </div>
    `;
  }

  mounted() {
    const $matchContainer = this.$target.querySelector("#match-container");
    const $matchTypeDropdownHolder = this.$target.querySelector(
      "#match-type-dropdown"
    );

    const matchTypeDropdown = new MatchTypeDropdown($matchTypeDropdownHolder);
    const bouncingBallOnRacket = new BouncingBallOnRacket($matchContainer, {
      findingMatch: true,
    });

    matchTypeDropdown.render();
    bouncingBallOnRacket.render();
  }
}
