import Component from "../../core/Component.js";
import InputGroup from "../UI/Input/InputGroup.js";
import Button from "../UI/Button/Button.js";
import signUpHandler from "../../handlers/auth/signUpHandler.js";
import {
  idValidationHandler,
  nicknameValidationHandler,
  passwordValidationHandler,
  validateEmailHandler,
  verifyPasswordHandler,
} from "../../handlers/user/inputValidateHandlers.js";

export default class SignUpForm extends Component {
  setEvent() {
    this.addEvent("submit", "#sign-up-form", signUpHandler);
    const validateFormHandler = () => {
      if (
        this.idInputGroup.state.isValid &&
        this.nicknameInputGroup.state.isValid &&
        this.pwInputGroup.state.isValid &&
        this.pwVerifyInputGroup.state.isValid &&
        this.emailInputGroup.state.isValid
      ) {
        this.signUpButton.props.disabled = false;
        this.signUpButton.render();
      } else {
        this.signUpButton.props.disabled = true;
        this.signUpButton.render();
      }
    };
    this.$target.addEventListener("input", validateFormHandler);
    this.eventListeners.push("input", validateFormHandler);
  }

  template() {
    return `
    <form
      id="sign-up-form"
      class="d-flex flex-column align-items-center"
    >
      <div id="id-input-group-holder" class="mt-3"></div>
      <div id="nickname-input-group-holder"></div>
      <div id="pw-input-group-holder"></div>
      <div id="verify-pw-input-group-holder"></div>
      <div id="email-input-group-holder"></div>
      <div id="sign-up-btn-holder" class="mt-3"></div>
    </form>
    `;
  }

  mounted() {
    const $signUpForm = this.$target.querySelector("#sign-up-form");

    const idInputProps = {
      type: "text",
      id: "signup-form-id",
      pattern: "^[A-Za-z0-9]+$",
      name: "signup-form",
      placeholder: "8 ~ 24 characters",
      autocomplete: true,
      required: true,
    };
    const nicknameInputProps = {
      type: "text",
      id: "signup-form-nickname",
      name: "signup-form",
      placeholder: "4 ~ 16 characters",
      autocomplete: true,
      required: true,
    };
    const pwInputProps = {
      type: "password",
      id: "signup-form-pw",
      pattern: "(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,20}",
      name: "signup-form",
      placeholder: "8 ~ characters",
      autocomplete: true,
      required: true,
    };
    const pwVerifyInputProps = {
      type: "password",
      id: "signup-form-pw-verify",
      name: "signup-form",
      required: true,
    };
    const emailInputProps = {
      type: "email",
      id: "signup-form-email",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      name: "signup-form",
      placeholder: "hello@example.com",
      required: true,
    };

    this.idInputGroup = new InputGroup(
      $signUpForm.querySelector("#id-input-group-holder"),
      {
        labelText: "ID",
        validate: idValidationHandler,
        inputProps: idInputProps,
        holderId: "id-input-holder",
      },
      this
    );
    this.nicknameInputGroup = new InputGroup(
      $signUpForm.querySelector("#nickname-input-group-holder"),
      {
        labelText: "Nickname",
        validate: nicknameValidationHandler,
        warningText: "",
        inputProps: nicknameInputProps,
        holderId: "nickname-input-holder",
      },
      this
    );
    this.pwInputGroup = new InputGroup(
      $signUpForm.querySelector("#pw-input-group-holder"),
      {
        labelText: "Password",
        validate: passwordValidationHandler,
        inputProps: pwInputProps,
        holderId: "pw-input-holder",
      },
      this
    );
    this.pwVerifyInputGroup = new InputGroup(
      $signUpForm.querySelector("#verify-pw-input-group-holder"),
      {
        labelText: "Verify Password",
        validate: verifyPasswordHandler,
        inputProps: pwVerifyInputProps,
        holderId: "pw-verify-input-holder",
      },
      this
    );
    this.emailInputGroup = new InputGroup(
      $signUpForm.querySelector("#email-input-group-holder"),
      {
        labelText: "E-mail",
        validate: validateEmailHandler,
        inputProps: emailInputProps,
        holderId: "email-input-holder",
      },
      this
    );

    this.signUpButton = new Button(
      $signUpForm.querySelector("#sign-up-btn-holder"),
      {
        type: "submit",
        disabled: true,
        content: "Sign Up",
        attributes: 'style="min-width: 10rem"',
      },
      this
    );

    this.idInputGroup.render();
    this.nicknameInputGroup.render();
    this.pwInputGroup.render();
    this.pwVerifyInputGroup.render();
    this.emailInputGroup.render();
    this.signUpButton.render();

    this.idInputGroup.$target.querySelector(`#${idInputProps.id}`).focus();
  }
}
