import Component from "../../core/Component.js";
import appendCSSLink from "../../utils/appendCSSLink.js";
import Button from "../UI/Button/Button.js";

appendCSSLink("src/components/Lobby/MatchTypeDropdown.css");

export default class MatchTypeDropdown extends Component {
  template() {
    return `
      <div
        id="match-type-btn-holder"
        ${this.props.isFindingMatch ? "" : `data-bs-toggle="dropdown"`}
        aria-expanded="false"
      ></div>
      <ul 
        class="dropdown-menu rounded-5 match-type-dropdown-ul fs-5 fw-bold text-center"
      >
        <li class="match-type-dropdown-li">1 vs 1</li>
        <li class="match-type-dropdown-li">Tournament</li>
        <li class="match-type-dropdown-li">Single Play</li>
      </ul>
    `;
  }

  mounted() {
    const { matchType, isFindingMatch, isMatchFound } = this.props;

    const matchTypeButton = new Button(
      this.$target.querySelector("#match-type-btn-holder"),
      {
        content: matchType,
        className: "dropdown-toggle",
        attributes: `style="width: 15rem"`,
        disabled: isFindingMatch || isMatchFound,
      }
    );
    matchTypeButton.render();
  }
}
