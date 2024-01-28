// import PageContainer from "../components/UI/Container/PageContainer.js";
import PageContainerWithLogo from "../components/UI/Container/PageContainerWithLogo.js";
import Component from "../core/Component.js";

export default class LandingPage extends Component {
  template() {
    return `
      <div id="landing-page-content">
        <h1>Landing Page</h1>
      </div>
    `;
  }

  mounted() {
    const $pageContent = this.$target.querySelector("#landing-page-content");

    const pageContainer = new PageContainerWithLogo(this.$target, $pageContent);
    pageContainer.render();
  }
}
