import Component from "../../core/Component.js";
import Input from "../UI/Input/Input.js";
import Button from "../UI/Button/Button.js";

export default class TwoFAForm extends Component {
  template() {
    return `
      <div 
        class="
        input-group
        d-flex
        align-items-center
        justify-content-center
        my-3
      ">
        <label
          class="
          fw-bold fs-5 info-input-label-text
          position-absolute
          "
        >
          Verification Code
        </label>
        <div id="two-fa-input-holder" class="mx-3"></div>
        <div id="send-code-button-holder"></div>
        <span class="
          info-input-warning-text
          position-absolute
        ">
          Wrong verification code
        </span>
      </div>
		`;
  }

  mounted() {
    const codeInput = new Input(
      this.$target.querySelector("#two-fa-input-holder"),
      {
        type: "text",
        name: "two-fa-code",
        placeholder: "Your code",
        autocomplete: false,
        required: true,
      }
    );
    const sendCodeButton = new Button(
      this.$target.querySelector("#send-code-button-holder"),
      { small: true, name: "send-code-btn", content: "Send again" }
    );

    codeInput.render();
    sendCodeButton.render();
  }
}
