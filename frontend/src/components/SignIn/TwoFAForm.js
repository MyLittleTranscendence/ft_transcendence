import Component from "../../core/Component.js";
import Input from "../UI/Input/Input.js";
import Button from "../UI/Button/Button.js";

export default class TwoFAForm extends Component {
  template() {
    return `
      <form
        id="two-fa-form"
        class="
        d-flex
        flex-column
        align-items-center
        "
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
            class="fw-bold"
            style="color: #b2b2b2"
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
    const $container = this.$target.querySelector("#two-fa-group-container");
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
      name: "send-code-btn",
      content: "Send again",
    });
    const confirmButton = new Button(
      this.$target.querySelector("#two-fa-form"),
      {
        name: "two-fa-confirm",
        content: "Confirm",
        type: "submit",
        className: "mt-5",
        attributes: `style="min-width: 10rem;"`,
      }
    );

    codeInput.render();
    sendCodeButton.render();
    confirmButton.render();

    this.startTimer(179);
  }

  startTimer(duration) {
    let timer = duration;
    let minutes;
    let seconds;
    const interval = setInterval(() => {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      const $timerElement = this.$target.querySelector("#two-fa-timer");
      $timerElement.textContent = `${minutes}:${seconds}`;

      timer -= 1;
      if (timer < 0) {
        clearInterval(interval);
        $timerElement.textContent = "00:00";
        // Confirm 버튼 비활성화 로직
      }
    }, 1000);
  }
}
