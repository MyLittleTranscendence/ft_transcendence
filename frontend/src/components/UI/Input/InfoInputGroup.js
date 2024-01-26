import Component from "../../../core/Component.js";
import appendCSSLink from "../../../utils/appendCSSLink.js";
import Input from "./Input.js";

appendCSSLink("src/components/UI/Input/InfoInputGroup.css");

export default class InfoInputGroup extends Component {
  template() {
    const { lableText, warningText, holderId } = this.$props;
    return `
    <div class="input-group col d-flex align-items-center position-relative my-3">
      <lable class="
        fw-bold fs-5 info-input-lable-text
        position-absolute"
      >
        ${lableText}
      </lable>
      <div id="${holderId}"></div>
      <span class="
        info-input-warning-text
        position-absolute"
      >
        ${warningText}
      </span>
    </div>`;
  }

  mounted() {
    const { holderId } = this.$props;
    const divElement = this.$target.querySelector(`#${holderId}`);
    const inputComponent = new Input(divElement, this.$props.inputProps);
    inputComponent.render();
  }
}
