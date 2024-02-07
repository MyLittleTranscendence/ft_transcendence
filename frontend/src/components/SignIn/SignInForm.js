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
      <div id="input-group-container"></div>
      <div
        id="sign-in-warningtext"
        style="
        font-size: 0.8rem; margin-bottom: 0.5rem;
        font-weight: bold; height: 1rem;
        ">
      </div>
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

    const idInputGroup = new InputGroup($inputGroupContainer, {
      labelText: "ID",
      inputProps: idInputProps,
      holderId: "id-input-holder",
    });
    const pwInputGroup = new InputGroup($inputGroupContainer, {
      labelText: "Password",
      inputProps: pwInputProps,
      holderId: "pw-input-holder",
    });
    const signInButton = new Button($signInBtnHolder, {
      type: "submit",
      content: "Sign In",
      disabled: false,
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

  displayWarningText() {
    const warningTextElement = document.createElement("div");
    warningTextElement.setAttribute("id", "warning-text");
    warningTextElement.textContent = "ID or PW is Incorrect";
    warningTextElement.style.color = "#ff9d9d"; // 스타일은 예시이며, 필요에 따라 조정하세요.

    const signInBtnHolder = document.querySelector("#sign-in-btn-holder");
    signInBtnHolder.parentNode.insertBefore(
      warningTextElement,
      signInBtnHolder
    );
  }
}
