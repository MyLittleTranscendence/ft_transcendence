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
      </div>
    `;
  }

  mounted() {
    const $SignInContent = this.$target.querySelector("#signin-page-content");

    const pageContainer = new PageContainer(this.$target, $SignInContent);
    const twoFAForm = new TwoFAForm($SignInContent, { type: "signin" });

    pageContainer.render();
    twoFAForm.render();
  }
}
