import Component from "../../../core/Component.js";
import appendCSSLink from "../../../utils/appendCSSLink.js";

appendCSSLink("src/components/UI/Input/Input.css");

export default class Input extends Component {
  template() {
    const {
      type,
      id,
      pattern,
      name,
      value,
      placeholder,
      autocomplete,
      required,
      disabled,
      className,
    } = this.$props;

    return `
      <input
        type="${type}"
        id="${id}"
        ${pattern ? `pattern="${pattern}"` : ""}
        name="${name}"
        ${value ? `value="${value}"` : ""}
        ${placeholder ? `placeholder="${placeholder}` : ""}"
        autocomplete=${autocomplete ? "on" : "off"}
        ${required ? "required" : ""}
        ${disabled ? "disabled" : ""}
        class="form-control rounded-pill input-general ${className ? `${className}` : ""}"
      >
    `;
  }
}
