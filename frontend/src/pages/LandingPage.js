import PageContainer from "../components/UI/Container/PageContainer.js";
import SignInLink from "../components/Landing/SignInLink.js";
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
          <div id="landing-page-link-container" class="d-grid gap-3 mx-auto mt-3">
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
      "#landing-page-link-container"
    );

    const signInLink = new SignInLink($buttonContainer, {
      content: "Sign In",
      path: "/sign-in",
    });
    const signInWith42Link = new SignInLink($buttonContainer, {
      content: `Sign In with <img src="asset/42logo.png" style="max-width: 2rem;" />`,
      path: "http://localhost:8000/api/login/oauth2/42api",
    });

    signInLink.render();
    signInWith42Link.render();
  }
}
