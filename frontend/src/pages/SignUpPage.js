import Component from "../core/Component.js";
import PageContainer from "../components/UI/Container/PageContainer.js";
import SignUpForm from "../components/Form/SignUpForm.js";
import Button from "../components/UI/Button/Button.js";

export default class SignUpPage extends Component {
  template() {
    return `
      <div
        id="page-content"
        class="d-flex flex-column align-items-center justify-content-center"
      >
        <div
          class="container-sm d-flex flex-column align-items-center"
          style="max-width: 40%; min-width: 10rem; padding: 13vw 0 13vw 0;"
        >
          <img
            src="asset/logo-large.png"
            class="img-fluid"
          />
          <div
            id="sign-up-form-content"
          >
          </div>
          <div
            id="sign-up-button-content"
          >
          </div>
        </div>
      </div>
    `;
  }
  mounted() {
    const $pageContent = this.$target.querySelector("#page-content");
    const $signUpContent = this.$target.querySelector("#sign-up-form-content");
    const $signUpButton = this.$target.querySelector("#sign-up-button-content");
    const pageContainer = new PageContainer(this.$target, $pageContent);
    const signUpForm = new SignUpForm($pageContent, $signUpContent);
    const signUpButton = new Button($pageContent, $signUpButton); // TODO : 버튼에 props 전달하기
    pageContainer.render();
    signUpForm.render();
    signUpButton.render();
  }
}
