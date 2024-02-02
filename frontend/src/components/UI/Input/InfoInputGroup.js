import Component from "../../../core/Component.js";
import appendCSSLink from "../../../utils/appendCSSLink.js";
import Input from "./Input.js";

appendCSSLink("src/components/UI/Input/InfoInputGroup.css");

export default class InfoInputGroup extends Component {
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
        fw-bold fs-5 info-input-label-text
        position-absolute
        ">
        ${labelText}
      </label>
      <div id="${holderId}" class="mx-3"></div>
      <span class="
        info-input-warning-text
        position-absolute
      ">
        ${warningText}
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
