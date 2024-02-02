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
      </div>
    `;
  }

  mounted() {
    const $SignUpContent = this.$target.querySelector(
      "#signup-page-content"
    );
  
    const pageContainer = new PageContainer(this.$target, $SignUpContent);
    const signUpForm = new SignUpForm($SignUpContent);

    pageContainer.render();
    signUpForm.render();  
  }
}
