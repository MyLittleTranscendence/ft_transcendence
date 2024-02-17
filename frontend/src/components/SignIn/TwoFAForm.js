import Component from "../../core/Component.js";
import Input from "../UI/Input/Input.js";
import Button from "../UI/Button/Button.js";
import fetchSendCode from "../../api/auth/fetchSendCode.js";
import twoFAHandler from "../../handlers/twoFAHandler.js";

export default class TwoFAForm extends Component {
  constructor($target, props, state) {
    super($target, props, state);
    this.timerInterval = null;
    this.isFirstRender = true;
  }

  setup() {
    this.state = {
      notifyText: "sending code to your email...",
      isTimeout: false,
    };
  }

  setEvent() {
    this.addEvent("submit", "#two-fa-form", (e) => {
      twoFAHandler(e, this.props.setIsEditingFalse);
    });
    this.addEvent("click", "#send-code-btn", () =>
      fetchSendCode((email) => this.onCodeSendSuccess(email))
    );
  }

  template() {
    return `
      <form
        id="two-fa-form"
        class="d-flex flex-column align-items-center"
        data-form-type=${this.props.type}
        style="width: 30rem;"
      >
        <p id="code-sent-notification" style="color:#c2c2c2;">
          ${this.state.notifyText || " "} 
        </p>
        <div
          id="two-fa-group-container"
          class="
            input-group
            d-flex
            align-items-center
            justify-content-center
            position-relative
            mt-3
          "
          style="max-width: 15rem"
        >
          <label
            for="two-fa-code-input"
            class="fw-bold position-absolute input-group-left"
          >
            Verification Code
          </label>
          <span
            id="two-fa-timer"
            class="text-white fw-semibold position-absolute"
            style="transform: translate(200%, -120%);"
          >
            03:00
          </span>
          <div id="code-input-holder"></div>
          <div id="send-code-btn-holder"></div>
        </div>
        <div id="confirm-btn-holder" class="mt-2"></div>
      </form>
		`;
  }

  mounted() {
    const { type } = this.props; // "enable" or "signin"

    const $container = this.$target.querySelector("#two-fa-group-container");
    const $form = this.$target.querySelector("#two-fa-form");

    const codeInput = new Input(
      $container.querySelector("#code-input-holder"),
      {
        type: "text",
        id: "two-fa-code-input",
        name: "two-fa-code",
        placeholder: "Your code",
        autocomplete: false,
        required: true,
        className: "mx-2",
      }
    );
    const sendCodeButton = new Button(
      $container.querySelector("#send-code-btn-holder"),
      {
        small: true,
        id: "send-code-btn",
        name: "send-code-btn",
        content: "Send again",
        className: "position-absolute input-group-right",
        attributes: `style="color: white !important"`,
      }
    );
    const confirmButton = new Button(
      $form.querySelector("#confirm-btn-holder"),
      {
        id: `two-fa-${type}`,
        name: `two-fa-${type}-confirm`,
        content: type === "signin" ? "Confirm" : "Enable 2FA",
        small: type === "enable",
        type: "submit",
        className: "mt-2",
        attributes: `style="min-width: 10rem;"`,
        disabled: this.state.isTimeout,
      }
    );

    codeInput.render();
    sendCodeButton.render();
    confirmButton.render();

    if (this.isFirstRender) {
      fetchSendCode((email) => this.onCodeSendSuccess(email));
      this.isFirstRender = false;
    }
  }

  onCodeSendSuccess(email) {
    this.setState({ notifyText: `Verification code has sent to ${email}` });
    this.startTimer(179, this.$target.querySelector("#two-fa-timer"));
  }

  startTimer(duration, $timerElement) {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    let timeLeft = duration;
    let minutes;
    let seconds;

    const $timer = $timerElement;

    this.timerInterval = setInterval(() => {
      minutes = parseInt(timeLeft / 60, 10);
      seconds = parseInt(timeLeft % 60, 10);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      $timer.textContent = `${minutes}:${seconds}`;

      timeLeft -= 1;
      if (timeLeft < 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
        this.setState({ isTimeout: true });
      }
    }, 1000);
  }
}
