import Component from "../../../core/Component.js";
import appendCSSLink from "../../../utils/appendCSSLink.js";

appendCSSLink("src/components/UI/Button/Button.css");

export default class Button extends Component {
  template() {
    const { disabled, name, loading, small, content, className } = this.props;

    return `
      <button
        type="button"
        ${name ? `name="${name}"` : ""}
        class="btn rounded-pill
        ${className ? className : ""}
        ${small ? "btn-sm" : "btn-lg"}"
        ${(disabled || loading) ? "disabled" : ""}
      >
        ${loading ? '<div class="spinner-grow spinner-grow-sm"></div>' : `${content}`}
      </button>
    `;
  }
}