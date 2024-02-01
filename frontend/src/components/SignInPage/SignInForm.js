import Component from "../../core/Component.js";
import Button from "../UI/Button/Button.js";
import InfoInputGroup from "../UI/Input/InfoInputGroup.js";
import Link from "../UI/Link/Link.js";

export default class SigninForm extends Component {
  template() {
    return `
    <form
      id="sign-in-form"
      class="d-flex flex-column align-items-center"
    >
      <div id="input-group-container"></div>
      <div id="sign-in-btn-holder"></div>
      <text
        class="fw-bold mt-5 mb-2"
        style="color: #b2b2b2"
      >
        Are you not registered?
      </text>
    </form>
    `;
  }

  mounted() {
    const $signInForm = this.$target.querySelector("#sign-in-form");
    const $inputGroupContainer = $signInForm.querySelector(
      "#input-group-container"
    );
    const $signInBtnHolder = $signInForm.querySelector("#sign-in-btn-holder");

    const idInputProps = {
      type: "text",
      id: "login-form-id",
      name: "login-form",
      // value:
      placeholder: "Input ID",
      autocomplete: true,
      required: true,
    };
    const pwInputProps = {
      type: "password",
      id: "login-form-pw",
      name: "login-form",
      // value:
      placeholder: "Input Password",
      autocomplete: true,
      required: true,
    };

    const idInputGroup = new InfoInputGroup($inputGroupContainer, {
      labelText: "ID",
      warningText: "ID does not exist",
      inputProps: idInputProps,
      holderId: "id-input-holder",
    });
    const pwInputGroup = new InfoInputGroup($inputGroupContainer, {
      labelText: "Password",
      warningText: "Wrong password",
      inputProps: pwInputProps,
      holderId: "pw-input-holder",
    });
    const signInButton = new Button($signInBtnHolder, {
      content: "Sign In",
      disabled: true,
      attributes: `style="min-width: 10rem"`,
    });
    const signUpButton = new Link(this.$target, {
      content: "Sign Up",
      href: "/sign-up",
      attributes: `style="min-width: 10rem"`,
    });

    idInputGroup.render();
    pwInputGroup.render();
    signInButton.render();
    signUpButton.render();
  }
}
