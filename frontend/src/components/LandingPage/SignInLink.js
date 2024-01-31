import Component from "../../core/Component.js";
import appendCSSLink from "../../utils/appendCSSLink.js";

appendCSSLink("src/components/LandingPage/SignInLink.css");

export default class SignInLink extends Component {
  template() {
    const { content, path } = this.props;

    return `
      <a href="${path}" class="btn btn-lg bg-white rounded-pill sign-in-link">
        ${content}
      </a>
    `;
  }
}
