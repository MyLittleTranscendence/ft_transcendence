import Component from "../../core/Component.js";
import InputGroup from "../UI/Input/InputGroup.js";
import Button from "../UI/Button/Button.js";
import signUpHandler from "../../handlers/auth/signUpHandler.js";

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

    const idInputGroup = new InputGroup(
      $signUpForm.querySelector("#id-input-group-holder"),
      {
        labelText: "ID",
        warningText: "",
        inputProps: idInputProps,
        holderId: "id-input-holder",
      }
    );
    const nicknameInputGroup = new InputGroup(
      $signUpForm.querySelector("#nickname-input-group-holder"),
      {
        labelText: "Nickname",
        warningText: "",
        inputProps: nicknameInputProps,
        holderId: "nickname-input-holder",
      }
    );
    const pwInputGroup = new InputGroup(
      $signUpForm.querySelector("#pw-input-group-holder"),
      {
        labelText: "Password",
        warningText: "",
        inputProps: pwInputProps,
        holderId: "pw-input-holder",
      }
    );
    const pwVerifyInputGroup = new InputGroup(
      $signUpForm.querySelector("#verify-pw-input-group-holder"),
      {
        labelText: "Verify Password",
        warningText: "",
        inputProps: pwVerifyInputProps,
        holderId: "pw-verify-input-holder",
      }
    );
    const emailInputGroup = new InputGroup(
      $signUpForm.querySelector("#email-input-group-holder"),
      {
        labelText: "E-mail",
        warningText: "",
        inputProps: emailInputProps,
        holderId: "email-input-holder",
      }
    );
    const signUpButton = new Button(
      $signUpForm.querySelector("#sign-up-btn-holder"),
      {
        type: "submit",
        disabled: false,
        content: "Sign Up",
        attributes: 'style="min-width: 10rem"',
      }
    );

    idInputGroup.render();
    nicknameInputGroup.render();
    pwInputGroup.render();
    pwVerifyInputGroup.render();
    emailInputGroup.render();
    signUpButton.render();
  }
}
