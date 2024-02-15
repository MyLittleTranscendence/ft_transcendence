import Component from "../../../core/Component.js";
import appendCSSLink from "../../../utils/appendCSSLink.js";

appendCSSLink("src/components/UI/Button/Button.css");

export default class Button extends Component {
  template() {
    const {
      id,
      type,
      disabled,
      name,
      loading,
      small,
      content,
      className,
      attributes,
    } = this.props;

    return `
      <button
        id="${id}"
        type="${type || "button"}"
        ${name ? `name="${name}"` : ""}
        class="btn rounded-pill button-custom
        ${className ? `${className}` : ""}"
        ${small ? "btn-sm" : "btn-lg"}"
        ${disabled || loading ? "disabled" : ""}
        ${attributes || ""}
      >
        ${loading ? '<div class="spinner-grow spinner-grow-sm"></div>' : `${content}`}
      </button>
    `;
  }
}
