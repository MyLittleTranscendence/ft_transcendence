import Component from "../../../core/Component.js";
import appendCSSLink from "../../../utils/appendCSSLink.js";
import Input from "./Input.js";

appendCSSLink("src/components/UI/Input/InputGroup.css");

export default class InputGroup extends Component {
  template() {
    const { labelText, warningText, holderId, inputProps } = this.props;
    return `
    <div class="
      input-group
      d-flex
      align-items-center
      justify-content-center
      my-3
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
      <span class="
        input-group-right
        position-absolute
      ">
        ${warningText ? warningText : ""}
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
