import Component from "../../core/Component.js";
import twoFASwitchHandler from "../../handlers/api/twoFASwitchHandler.js";
import appendCSSLink from "../../utils/appendCSSLink.js";

appendCSSLink("src/components/Lobby/TwoFASwitch.css");

export default class TwoFASelectSwitch extends Component {
  template() {
    return `
    <label>
      <input 
        id="two-fa-switch"
        class="two-fa-switch-input"
        type="checkbox"
      />
      2FA
    </label>
    `;
  }

  mounted() {
    this.addEvent("click", "#two-fa-switch", twoFASwitchHandler);
  }
}
