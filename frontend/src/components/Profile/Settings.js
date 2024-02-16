import Component from "../../core/Component.js";
import { myInfoStore } from "../../store/initialStates.js";
import Input from "../UI/Input/Input.js";
import emailUpdateHandler from "../../handlers/emailUpdateHandler.js";
import TwoFAForm from "../SignIn/TwoFAForm.js";
import Button from "../UI/Button/Button.js";
import disableTwoFAHandler from "../../handlers/disableTwoFAHandler.js";

export default class Settings extends Component {
  setup() {
    this.state = {
      isEditingEmail: false,
      isEditingTwoFA: false,
    };
    const unsubscribe = myInfoStore.subscribe(this);
    this.removeObservers.push(unsubscribe);
  }

  setEvent() {
    this.addEvent("click", "#email-edit-icon", () =>
      this.setState({ isEditingEmail: true })
    );
    this.addEvent("click", "#email-edit-done-icon", () => {
      const $input = this.$target.querySelector("#email-edit-input");
      emailUpdateHandler($input.value.trim(), $input.defaultValue, () =>
        this.setState({ isEditingEmail: false })
      );
    });
    this.addEvent("click", "#two-fa-enable-btn", () =>
      this.setState({ isEditingTwoFA: true })
    );
    this.addEvent("click", "#two-fa-disable-btn", disableTwoFAHandler);
  }

  template() {
    return `
      <h4 class="text-white fw-bold">Settings</h4>
      <h6 class="text-white fw-bold">E-Mail</h6>
      ${
        this.state.isEditingEmail
          ? `<div
              id="email-edit-input-group" 
              class="position-relative d-flex align-items-center"
            >
              <div id="email-input-holder"></div>
              <svg id="email-edit-done-icon" class="position-absolute" style="right: -2rem; cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#00C213" class="bi bi-check-lg" viewBox="0 0 16 16">
                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
              </svg>
            </div>`
          : `<text class="position-relative d-flex align-items-center g-light-grey fst-italic fw-bold">
              ${myInfoStore.getState().email}
              <svg id="email-edit-icon" class="position-absolute" style="right: -1.5rem; cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-pencil-square" viewBox="0 0 16 16">
                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
              </svg>
            </text>`
      }
      <br>
      <h6 class="text-white fw-bold">2-Factor Authentication</h6>
      <div id="two-fa-form-holder" class="mt-2"></div>
      
    `;
  }

  mounted() {
    const { isEditingEmail, isEditingTwoFA } = this.state;

    if (isEditingEmail) {
      const emailInput = new Input(
        this.$target.querySelector("#email-input-holder"),
        {
          id: "email-edit-input",
          type: "email",
          required: true,
          value: myInfoStore.getState().email,
          attributes: `style="width: 15rem;"`,
        }
      );
      emailInput.render();
    }

    const $twofaHolder = this.$target.querySelector("#two-fa-form-holder");

    console.log(myInfoStore.getState());

    if (myInfoStore.getState().mfa_enable === false) {
      if (!isEditingTwoFA) {
        const twoFAEnableButton = new Button($twofaHolder, {
          id: "two-fa-enable-btn",
          content: "Enable 2FA",
          small: true,
        });
        twoFAEnableButton.render();
      } else {
        const twoFAForm = new TwoFAForm(
          $twofaHolder,
          {
            type: "enable",
            setIsEditingFalse: () => this.setState({ isEditingTwoFA: false }),
          },
          this
        );
        twoFAForm.render();
      }
    } else {
      const twoFADisableButton = new Button($twofaHolder, {
        id: "two-fa-disable-btn",
        content: "Disable 2FA",
        small: true,
      });
      twoFADisableButton.render();
    }
  }
}
