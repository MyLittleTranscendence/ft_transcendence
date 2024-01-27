import Component from "../../../core/Component.js";
import appendCSSLink from "../../../utils/appendCSSLink.js";

appendCSSLink("src/components/UI/Button/Button.css");

export default class Button extends Component {
  template() {
    const { disabled, name } = this.$props;

    return `
	    <button
        ${disabled ? "disabled" : ""}
        name="${name}"
        class="button-general" 
      >
      ${name}
      </button>
    `;
  }
}
