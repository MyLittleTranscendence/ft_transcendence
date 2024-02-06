import Component from "../core/Component.js";
import TwoFAForm from "../components/SignIn/TwoFAForm.js";
import Button from "../components/UI/Button/Button.js";
import fetchDisableTwoFA from "../api/auth/fetchDisableTwoFA.js";

export default class JincparkTestPage extends Component {
  setup() {
    this.state = { mfa: sessionStorage.getItem("mfa_require") };
  }

  template() {
    return `
      <div class="d-flex flex-column">
        <h1>Test Page</h1>
        <div id="test" class="mt-5"></div>
        비활성화나 코드인증 하고 새로고침 해야 됨
      </div>`;
  }

  mounted() {
    const $div = this.$target.querySelector("#test");

    if (this.state.mfa === "false") {
      const twoFAForm = new TwoFAForm($div, { type: "enable" });
      twoFAForm.render();
    } else {
      const twoFADisableButton = new Button($div, {
        id: "two-fa-disable-btn",
        content: "Disable 2FA",
        small: true,
      });
      twoFADisableButton.render();
      twoFADisableButton.addEvent(
        "click",
        "#two-fa-disable-btn",
        fetchDisableTwoFA
      );
    }
  }
}
