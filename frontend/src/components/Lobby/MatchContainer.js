import Component from "../../core/Component.js";
import BouncingBallOnRacket from "../UI/BouncingBallOnRacket.js";
import MatchTypeDropdown from "./MatchTypeDropdown.js";

export default class MatchContainer extends Component {
  template() {
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
      <h3 class="text-white fw-bold">Play Now!</h3>
      <div id="ball-racket-holder"></div>
    `;
  }

  mounted() {
    const matchTypeDropdown = new MatchTypeDropdown(
      this.$target.querySelector("#match-type-dropdown")
    );
    const bouncingBallOnRacket = new BouncingBallOnRacket(
      this.$target.querySelector("#ball-racket-holder"),
      {
        findingMatch: true,
      }
    );

    matchTypeDropdown.render();
    bouncingBallOnRacket.render();
  }
}
