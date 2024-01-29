import Component from "../../../core/Component.js";
import appendCSSLink from "../../../utils/appendCSSLink.js";

appendCSSLink("src/components/UI/Button/Button.css");

export default class Button extends Component {
  template() {
    const { disabled, name, loading } = this.$props;
    const buttonClass = small ? 'button-small' : 'button-general';

    return `
	    <button
        ${disabled ? 'disabled' : ''}
        name="${name}"
        class="${buttonClass}" 
      >
      ${loading ? '<div class="spinner-border"></div>' : ''}
      ${name}
      </button>
    `;
  }
}
