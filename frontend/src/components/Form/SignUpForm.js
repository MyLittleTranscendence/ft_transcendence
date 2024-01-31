import Component from "../../core/Component.js";
import InfoInputGroup from "../UI/Input/InfoInputGroup.js";
import Button from "../UI/Button/Button.js"

export default class SignUpForm extends Component {
  template() {
    return `
    <form class="d-flex justify-content-center align-items-center">
      <div id="input-group-container"></div>
    </form>`;
  }

  mounted() {
    const $div = this.$target.querySelector("#input-group-container");

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
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      name: "signup-form",
      // value:
      placeholder: "hello@example.com",
      required: true,
    };

    const idInputGroup = new InfoInputGroup($div, {
      labelText: "ID",
      warningText: "ID already exists",
      inputProps: idInputProps,
      holderId: "id-input-holder",
    });
    const nicknameInputGroup = new InfoInputGroup($div, {
      labelText: "Nickname",
      warningText: "Nickname already exists",
      inputProps: nicknameInputProps,
      holderId: "nickname-input-holder",
    });
    const pwInputGroup = new InfoInputGroup($div, {
      labelText: "Password",
      warningText: "Password too short / Password too long",
      inputProps: pwInputProps,
      holderId: "pw-input-holder",
    });
    const pwVerifyInputGroup = new InfoInputGroup($div, {
      labelText: "Verify Password",
      warningText: "Password does not match",
      inputProps: pwVerifyInputProps,
      holderId: "pw-verify-input-holder",
    });
    const emailInputGroup = new InfoInputGroup($div, {
      labelText: "E-mail",
      warningText: "Wrong E-mail format",
      inputProps: emailInputProps,
      holderId: "email-input-holder",
    });
    const signUpButton = new Button($div, {
      disabled: true,
      content: "Sign Up",
    })

    idInputGroup.render();
    nicknameInputGroup.render();
    pwInputGroup.render();
    pwVerifyInputGroup.render();
    emailInputGroup.render();
    signUpButton.render();
  }
}
