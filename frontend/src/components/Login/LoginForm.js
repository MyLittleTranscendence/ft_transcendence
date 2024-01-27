import Component from "../../core/Component.js";
import InfoInputGroup from "../UI/Input/InfoInputGroup.js";

export default class LoginForm extends Component {
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

    const idInputGroup = new InfoInputGroup($div, {
      labelText: "ID",
      warningText: "ID does not exist",
      inputProps: idInputProps,
      holderId: "id-input-holder",
    });
    const pwInputGroup = new InfoInputGroup($div, {
      labelText: "Password",
      warningText: "Wrong password",
      inputProps: pwInputProps,
      holderId: "pw-input-holder",
    });

    idInputGroup.render();
    pwInputGroup.render();
  }
}
