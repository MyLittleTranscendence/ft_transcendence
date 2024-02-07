import Component from "../../core/Component.js";
import InputGroup from "../UI/Input/InputGroup.js";
import Button from "../UI/Button/Button.js";
import signUpHandler from "../../handlers/signUpHandler.js";

export default class SignUpForm extends Component {
  setEvent() {
    this.addEvent("submit", "#sign-up-form", signUpHandler);
  }

  template() {
    return `
    <form
      id="sign-up-form"
      class="d-flex flex-column align-items-center"
    >
      <div id="input-group-container"></div>
      <div id="sign-up-btn-holder"></div>
    </form>
    `;
  }

  mounted() {
    const $signUpForm = this.$target.querySelector("#sign-up-form");
    const $inputGroupContainer = $signUpForm.querySelector(
      "#input-group-container"
    );
    const $signUpBtnHolder = $signUpForm.querySelector("#sign-up-btn-holder");

    const idInputProps = {
      type: "text",
      id: "signup-form-id",
      pattern: "^[A-Za-z0-9]+$",
      name: "signup-form",
      // value:
      placeholder: "8 ~ 16 characters",
      autocomplete: true,
      required: true,
    };
    const nicknameInputProps = {
      type: "text",
      id: "signup-form-nickname",
      pattern: "^[A-Za-z0-9]+$",
      name: "signup-form",
      // value:
      placeholder: "4 ~ 16 characters",
      autocomplete: true,
      required: true,
    };
    const pwInputProps = {
      type: "password",
      id: "signup-form-pw",
      pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,20}",
      name: "signup-form",
      // value:
      placeholder: "12 ~ characters",
      autocomplete: true,
      required: true,
    };
    const pwVerifyInputProps = {
      type: "password",
      id: "signup-form-pw-verify",
      name: "signup-form",
      // value:
      required: true,
    };
    const emailInputProps = {
      type: "email",
      id: "signup-form-email",
      name: "signup-form",
      // value:
      placeholder: "hello@example.com",
      required: true,
    };

    const idInputGroup = new InputGroup($inputGroupContainer, {
      labelText: "ID",
      warningText: "",
      inputProps: idInputProps,
      holderId: "id-input-holder",
    });
    const nicknameInputGroup = new InputGroup($inputGroupContainer, {
      labelText: "Nickname",
      warningText: "",
      inputProps: nicknameInputProps,
      holderId: "nickname-input-holder",
    });
    const pwInputGroup = new InputGroup($inputGroupContainer, {
      labelText: "Password",
      warningText: "",
      inputProps: pwInputProps,
      holderId: "pw-input-holder",
    });
    const pwVerifyInputGroup = new InputGroup($inputGroupContainer, {
      labelText: "Verify Password",
      warningText: "",
      inputProps: pwVerifyInputProps,
      holderId: "pw-verify-input-holder",
    });
    const emailInputGroup = new InputGroup($inputGroupContainer, {
      labelText: "E-mail",
      warningText: "",
      inputProps: emailInputProps,
      holderId: "email-input-holder",
    });
    const signUpButton = new Button($signUpBtnHolder, {
      type: "submit",
      disabled: false,
      content: "Sign Up",
      attributes: 'style="min-width: 10rem"',
    });

    idInputGroup.render();
    nicknameInputGroup.render();
    pwInputGroup.render();
    pwVerifyInputGroup.render();
    emailInputGroup.render();
    signUpButton.render();
  }
}
