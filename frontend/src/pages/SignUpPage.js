import Component from "../core/Component.js";
import PageContainer from "../components/UI/Container/PageContainer.js";
import SignUpForm from "../components/Form/SignUpForm.js";

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
      </div>
    `;
  }

  mounted() {
    const $signUpPageContent = this.$target.querySelector(
      "#signup-page-content"
    );
  
    const pageContainer = new PageContainer(this.$target, $signUpPageContent);
    const signUpForm = new SignUpForm($signUpPageContent);

    pageContainer.render();
    signUpForm.render();  
  }
}
