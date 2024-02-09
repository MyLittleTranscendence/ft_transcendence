import Component from "../../core/Component.js";
import appendCSSLink from "../../utils/appendCSSLink.js";

appendCSSLink("src/components/start/SignInLink.css");

export default class SignInLink extends Component {
  template() {
    const { content, path, type } = this.props;

    return `
      <a
        href="${path}"
        class="btn btn-lg bg-white rounded-pill sign-in-link" 
        ${type === "default-sign-in" ? "data-link" : ""}
      >
        ${content}
      </a>
    `;
  }
}
