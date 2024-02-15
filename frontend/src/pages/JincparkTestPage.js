import Component from "../core/Component.js";
import TwoFAForm from "../components/SignIn/TwoFAForm.js";
import Button from "../components/UI/Button/Button.js";
import fetchDisableTwoFA from "../api/auth/fetchDisableTwoFA.js";
import { testStore, myInfoStore } from "../store/initialStates.js";

export default class JincparkTestPage extends Component {
  setEvent() {
    testStore.subscribe(this);

    function incrementHandler() {
      const currNumber = testStore.getState().number;
      testStore.setState({ number: currNumber + 1 });
    }
    function decrementHandler() {
      const currNumber = testStore.getState().number;
      testStore.setState({ number: currNumber - 1 });
    }

    this.addEvent("click", "#increment", incrementHandler);
    this.addEvent("click", "#decrement", decrementHandler);
  }

  template() {
    return `
      <div class="d-flex flex-column">
        <h1>Test Page</h1>
        <div id="test" class="mt-5"></div>
        비활성화나 코드인증 하고 새로고침 해야 됨
      </div>
      <button id="increment">+</button>
      <button id="decrement">-</button>
      <span>${testStore.getState().number}</span>
      `;
  }

  mounted() {
    const $div = this.$target.querySelector("#test");

    if (myInfoStore.getState().mfa_enable === false) {
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
