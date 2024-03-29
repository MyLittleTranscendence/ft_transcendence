import Component from "../core/Component.js";
import PageContainer from "../components/UI/Container/PageContainer.js";
import TwoFAForm from "../components/SignIn/TwoFAForm.js";

export default class TwoFAPage extends Component {
  template() {
    return `
      <div
        id="signin-page-content"
        class="d-flex flex-column align-items-center"
      >
        <h2 class="text-white">Sign-In to</h2>
        <div class="mb-5">
          <img src="asset/logo-medium.png" class="img-fluid">
        </div>
        <div id="two-fa-form-container"></div>
      </div>
    `;
  }

  mounted() {
    const $signInContent = this.$target.querySelector("#signin-page-content");

    const pageContainer = new PageContainer(this.$target, $signInContent);
    const twoFAForm = new TwoFAForm(
      $signInContent.querySelector("#two-fa-form-container"),
      { type: "signin" },
      this
    );

    pageContainer.render();
    twoFAForm.render();
  }
}
