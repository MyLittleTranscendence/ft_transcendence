import PageContainer from "../components/UI/Container/PageContainer.js";
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
          <div class="d-grid gap-3 mx-auto mt-3">
            <button
              type="button"
              class="btn bg-white btn-lg rounded-pill px-5 custom-button-hover"
              style="font-weight: 700;"
            >
              Sign In
            </button>
            <button
              type="button"
              class="btn bg-white btn-lg rounded-pill px-5 custom-button-hover"
              style="font-weight: 700;"
            >
              Sign In with
              <img src="asset/42logo.png" style="width: 2rem; height: auto;"/>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  mounted() {
    const $pageContent = this.$target.querySelector("#landing-page-content");

    const pageContainer = new PageContainer(this.$target, $pageContent);
    pageContainer.render();
  }
}
