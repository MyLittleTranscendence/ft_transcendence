import PageContainer from "../components/UI/Container/PageContainer.js";
import SignInLink from "../components/Start/SignInLink.js";
import Component from "../core/Component.js";

export default class StartPage extends Component {
  template() {
    return `
      <div
        id="start-page-content"
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
          <div class="d-grid gap-3 mx-auto mt-3">
            <div id="default-signin-link"></div>
            <div id="oauth-signin-link"></div>
          </div>
        </div>
      </div>
    `;
  }

  mounted() {
    const $pageContent = this.$target.querySelector("#start-page-content");

    const pageContainer = new PageContainer(this.$target, $pageContent);
    pageContainer.render();

    const signInLink = new SignInLink(
      $pageContent.querySelector("#default-signin-link"),
      {
        content: "Sign In",
        path: "/sign-in",
        type: "default-sign-in",
      }
    );
    const signInWith42Link = new SignInLink(
      $pageContent.querySelector("#oauth-signin-link"),
      {
        content: `Sign In with <img src="asset/42logo.png" style="max-width: 2rem;" />`,
        path: "http://localhost:3000/api/login/oauth2/42api",
      }
    );

    signInLink.render();
    signInWith42Link.render();
  }
}
