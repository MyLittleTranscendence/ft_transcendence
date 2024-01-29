import PageContainer from "../components/UI/Container/PageContainer.js";
import SignInButton from "../components/UI/Button/SignInButton.js";
import Component from "../core/Component.js";

export default class LandingPage extends Component {
  template() {
    return `
      <div
        id="landing-page-content"
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
          <div id="landing-page-button-container" class="d-grid gap-3 mx-auto mt-3">
            <a href="/sign-in" class="btn btn-lg bg-white rounded-pill sign-in-button">
              Sign In
            </a>
          </div>
        </div>
      </div>
    `;
  }

  mounted() {
    const $pageContent = this.$target.querySelector("#landing-page-content");

    const pageContainer = new PageContainer(this.$target, $pageContent);
    pageContainer.render();

    const $buttonContainer = this.$target.querySelector(
      "#landing-page-button-container"
    );

    const signInWith42Button = new SignInButton($buttonContainer, {
      content: "Sign In with ",
      logo: true,
    });

    signInWith42Button.render();
  }
}
