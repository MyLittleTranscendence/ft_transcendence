import Component from "../../../core/Component.js";
import appendCSSLink from "../../../utils/appendCSSLink.js";
import Input from "./Input.js";

appendCSSLink("src/components/UI/Input/InputGroup.css");

export default class InputGroup extends Component {
  setup() {
    this.state = { isValid: false };
  }

  setEvent() {
    const { validate } = this.props;
    if (validate) {
      this.addEvent("input", `#${this.props.inputProps.id}`, (e) => {
        validate(
          e,
          (text) => {
            this.$target.querySelector(
              `#${this.props.inputProps.id}-warning`
            ).textContent = text;
          },
          (isValid) => {
            this.state.isValid = isValid;
          }
        );
      });
    }
  }

  template() {
    const { labelText, holderId, inputProps } = this.props;
    return `
    <div class="
      input-group
      d-flex
      align-items-center
      justify-content-center
      my-2
    ">
      <label 
        for="${inputProps.id}"
        class="
        fw-bold fs-5 input-group-left
        position-absolute
        ">
        ${labelText}
      </label>
      <div id="${holderId}" class="mx-3"></div>
      <span 
        id="${inputProps.id}-warning"
        class="input-group-right position-absolute"
      >
      </span>
    </div>`;
  }

  mounted() {
    const { holderId, inputProps } = this.props;
    const $div = this.$target.querySelector(`#${holderId}`);
    const inputComponent = new Input($div, inputProps);
    inputComponent.render();
  }
}
