import Component from "../core/Component.js";
import PageContainer from "../components/UI/Container/PageContainer.js";
import SignUpForm from "../components/Form/SignUpForm.js";

export default class SignUpPage extends Component {
  template() {
    return `
      <div
        id="signup-page-content"
        class="d-flex flex-column align-items-center justify-content-center"
      >
        <div
          class="container-sm d-flex flex-column align-items-center"
          style="max-width: 40%; min-width: 10rem; padding: 8vw 0 8vw 0;"
        >
          <h2 style="font-weight: bold; color: white;">
            Sign-Up to
          </h2>
          <img
            src="asset/logo-large.png"
            class="img-fluid"
          />
          <div
            id="signup-form-content"
          >
          </div>
        </div>
      </div>
    `;
  }
  mounted() {
    const $pageContent = this.$target.querySelector(
      "#signup-page-content"
    );
  
    const pageContainer = new PageContainer(this.$target, $pageContent);
    pageContainer.render();
  
    const $signUpContent = this.$target.querySelector(
      "#signup-form-content"
    );
  
    const signUpForm = new SignUpForm($signUpContent);  
    signUpForm.render();
  }
}
