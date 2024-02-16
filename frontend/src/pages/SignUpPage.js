import Component from "../core/Component.js";
import PageContainer from "../components/UI/Container/PageContainer.js";
import SignUpForm from "../components/SignUp/SignUpForm.js";

export default class SignUpPage extends Component {
  template() {
    return `
      <div
        id="signup-page-content"
        class="d-flex flex-column align-items-center"
      >
        <h2 class="text-white">Sign-Up to</h2>
        <div>
          <img src="asset/logo-medium.png" class="img-fluid">
        </div>
        <div id="signup-form-container"></div>
      </div>
    `;
  }

  mounted() {
    const $signUpContent = this.$target.querySelector("#signup-page-content");

    const pageContainer = new PageContainer(this.$target, $signUpContent);
    const signUpForm = new SignUpForm(
      $signUpContent.querySelector("#signup-form-container"),
      {},
      this
    );

    pageContainer.render();
    signUpForm.render();
  }
}
