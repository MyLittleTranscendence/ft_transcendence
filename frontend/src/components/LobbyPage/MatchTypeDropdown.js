import Component from "../../core/Component.js";
import Button from "../UI/Button/Button.js";

export default class MatchTypeDropdown extends Component {
  template() {
    return `
      <ul class="dropdown-menu border rounded-5">
        <li class="text-center fs-5 fw-bold">1 vs 1</li>
        <li class="text-center fs-5 fw-bold">Tournament</li>
      </ul>
    `;
  }

  mounted() {
    const matchTypeButton = new Button(this.$target, {
      content: "Choose Match Type",
      className: "dropdown-toggle",
      attributes: `data-bs-toggle="dropdown" aria-expanded="false"`,
    });
    matchTypeButton.render();
  }
}
