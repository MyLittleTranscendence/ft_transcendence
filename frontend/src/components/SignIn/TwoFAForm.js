import Component from "../../core/Component.js";
import Input from "../UI/Input/Input.js";
import Button from "../UI/Button/Button.js";
import fetchSendCode from "../../api/fetchSendCode.js";
import twoFAHandler from "../../handlers/twoFAHandler.js";

export default class TwoFAForm extends Component {
  constructor($target, props, state) {
    super($target, props, state);
    this.timerInterval = null;
  }

  template() {
    return `
      <form
        id="two-fa-form"
        class="
        d-flex
        flex-column
        align-items-center
        "
        data-form-type=${this.props.type}
      >
        <div
          id="two-fa-group-container"
          class="
            input-group
            d-flex
            align-items-center
            justify-content-center
            position-relative
          "
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
        </div>
        <span
          id="two-fa-warning"
          class="mt-1 fw-bold"
          style="color: #FF9D9D;"
        >Wrong verification code</span>
      </form>
		`;
  }

  mounted() {
    const { type } = this.props; // "enable" or "signin"

    const $container = this.$target.querySelector("#two-fa-group-container");
    const $form = this.$target.querySelector("#two-fa-form");

    const codeInput = new Input($container, {
      type: "text",
      id: "two-fa-code-input",
      name: "two-fa-code",
      placeholder: "Your code",
      autocomplete: false,
      required: true,
      className: "mx-2",
    });
    const sendCodeButton = new Button($container, {
      small: true,
      id: "send-code-btn",
      name: "send-code-btn",
      content: "Send again",
      className: "position-absolute input-group-right",
      attributes: `style="color: white !important"`,
    });
    const confirmButton = new Button($form, {
      id: `two-fa-${type}`,
      name: `two-fa-${type}-confirm`,
      content: type === "signin" ? "Confirm" : "Enable 2FA",
      small: type === "enable",
      type: "submit",
      className: "mt-2",
      attributes: `style="min-width: 10rem;"`,
    });

    codeInput.render();
    sendCodeButton.render();
    confirmButton.render();

    this.addEvent("submit", "#two-fa-form", twoFAHandler);

    const timerHandler = () => {
      this.startTimer(179, this.$target.querySelector("#two-fa-timer"));
    };

    sendCodeButton.addEvent("click", "#send-code-btn", () =>
      fetchSendCode(timerHandler)
    );
    fetchSendCode(timerHandler);
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
        $timer.textContent = "00:00";
        // Confirm 버튼 비활성화 로직
      }
    }, 1000);
  }
}
