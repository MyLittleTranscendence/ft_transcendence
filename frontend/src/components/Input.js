import Component from "../core/Component.js";
import appendCSSLink from "../utils/appendCSSLink.js";

appendCSSLink("src/components/Input.css");

export default class Input extends Component {
  template() {
    const {
      type,
      id,
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
        name="${name}"
        ${value ? `value="${value}"` : ""}
        placeholder="${placeholder}"
        autocomplete=${autocomplete ? "on" : "off"}
        ${required ? "required" : ""}
        ${disabled ? "disabled" : ""}
        class="form-control rounded-pill input-general ${className}"
      >
    `;
  }
}
