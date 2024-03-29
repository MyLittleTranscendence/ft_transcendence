import Component from "../core/Component.js";
import PageContainer from "../components/UI/Container/PageContainer.js";
import InputGroup from "../components/UI/Input/InputGroup.js";
import Button from "../components/UI/Button/Button.js";
import handleSubmitNickname from "../handlers/user/setNicknameHandler.js";

export default class SetNicknamePage extends Component {
  setEvent() {
    // todo: nickname form 분리해야 함...
    this.addEvent("submit", "#nickname-form", handleSubmitNickname);
  }

  template() {
    return `
      <div
        id="setnickname-page-content"
        class="d-flex flex-column align-items-center"
      >
        <h2 class="text-white">Sign-In to</h2>
        <div class="mb-5">
          <img src="asset/logo-medium.png" class="img-fluid">
        </div>
        <p id="code-sent-notification" style="color:#c2c2c2;">Enter a nickname to be displayed to other users.</p>
        <form
          id="nickname-form"
          class="
            d-flex
            flex-column
            align-items-center
          "
        >
          <div id="nickname-input-holder" class="mb-3"></div>
          <div id="nickname-submit-btn-holder"></div>
        </form>
      </div>
    `;
  }

  mounted() {
    const $setNicknameContent = this.$target.querySelector(
      "#setnickname-page-content"
    );
    const $nicknameForm = $setNicknameContent.querySelector("#nickname-form");

    const pageContainer = new PageContainer(this.$target, $setNicknameContent);

    const nicknameInputProps = {
      type: "text",
      id: "nickname-input",
      name: "nickname-form",
      // value:
      placeholder: "Input nickname",
      autocomplete: true,
      required: true,
    };

    const nicknameInputGroup = new InputGroup(
      $nicknameForm.querySelector("#nickname-input-holder"),
      {
        labelText: "Nickname",
        inputProps: nicknameInputProps,
        holderId: "nickname-input-holder",
      }
    );

    const setNicknameButton = new Button(
      $nicknameForm.querySelector("#nickname-submit-btn-holder"),
      {
        id: "nickname-submit-btn",
        type: "submit",
        disabled: false,
        content: "Set Nickname",
        attributes: 'style="min-width: 10rem"',
      }
    );

    pageContainer.render();
    nicknameInputGroup.render();
    setNicknameButton.render();
  }
}
