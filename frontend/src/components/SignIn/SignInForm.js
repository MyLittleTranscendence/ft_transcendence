import Component from "../../core/Component.js";
import Button from "../UI/Button/Button.js";
import InputGroup from "../UI/Input/InputGroup.js";
import Link from "../UI/Link/Link.js";

import signInHandler from "../../handlers/signInHandler.js";

export default class SigninForm extends Component {
  setEvent() {
    this.addEvent("submit", "#sign-in-form", (event) => {
      signInHandler(event, this.$target.querySelector("#sign-in-warningtext"));
    });
  }

  template() {
    return `
    <form
      id="sign-in-form"
      class="d-flex flex-column align-items-center"
    >
      <div id="id-input-group"></div>
      <div id="pw-input-group"></div>
      <div
        id="sign-in-warningtext"
        style="
        font-size: 0.8rem; margin-bottom: 0.5rem;
        font-weight: bold; height: 1rem;
        font-size: 0.2rem; color: #ff9d9d;
        ">
      </div>
      <div id="signin-btn-holder"></div>
      <text
        class="fw-bold mt-5 mb-2"
        style="color: #b2b2b2"
      >
        Are you not registered?
      </text>
      <div id="signup-link-holder"></div>
    </form>
    `;
  }

  mounted() {
    const $signInForm = this.$target.querySelector("#sign-in-form");

    const idInputProps = {
      type: "text",
      id: "signin-form-id",
      name: "login-form",
      // value:
      placeholder: "Input ID",
      autocomplete: true,
      required: true,
    };
    const pwInputProps = {
      type: "password",
      id: "signin-form-pw",
      name: "login-form",
      // value:
      placeholder: "Input Password",
      autocomplete: true,
      required: true,
    };

    const idInputGroup = new InputGroup(
      $signInForm.querySelector("#id-input-group"),
      {
        labelText: "ID",
        inputProps: idInputProps,
        holderId: "id-input-holder",
      }
    );
    const pwInputGroup = new InputGroup(
      $signInForm.querySelector("#pw-input-group"),
      {
        labelText: "Password",
        inputProps: pwInputProps,
        holderId: "pw-input-holder",
      }
    );
    const signInButton = new Button(
      $signInForm.querySelector("#signin-btn-holder"),
      {
        type: "submit",
        content: "Sign In",
        disabled: false,
        attributes: `style="min-width: 10rem"`,
      }
    );
    const signUpButton = new Link(
      $signInForm.querySelector("#signup-link-holder"),
      {
        content: "Sign Up",
        href: "/sign-up",
        attributes: `style="min-width: 10rem"`,
      }
    );

    idInputGroup.render();
    pwInputGroup.render();
    signInButton.render();
    signUpButton.render();
  }
}
