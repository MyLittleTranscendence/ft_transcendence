import Component from "../core/Component.js";
import PageContainer from "../components/UI/Container/PageContainer.js";
import SigninForm from "../components/SignInPage/SignInForm.js";

export default class SignInPage extends Component {
  template() {
    return `
      <div
        id="signin-page-content"
        class="d-flex flex-column align-items-center"
      >
        <h2 class="text-white">Sign-In to</h2>
        <div>
          <img src="asset/logo-medium.png" class="img-fluid">
        </div>
      </div>
    `;
  }

  mounted() {
    const $signInPageContent = this.$target.querySelector(
      "#signin-page-content"
    );

    const pageContainer = new PageContainer(this.$target, $signInPageContent);
    const signInForm = new SigninForm($signInPageContent);

    pageContainer.render();
    signInForm.render();
  }
}
