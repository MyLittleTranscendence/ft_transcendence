import Component from "../../../core/Component.js";
import appendCSSLink from "../../../utils/appendCSSLink.js";

appendCSSLink("src/components/UI/Button/SignInButton.css");

export default class SignInButton extends Component {
  template() {
    const { id, content, type, path } = this.props;

    if (type === "link") {
      return `
        <a href="${path}" class="btn btn-lg bg-white rounded-pill sign-in-button">
          ${content}
        </a>
      `;
    }
    return `
      <button
        id="${id}"
        type="button"
        class="btn bg-white btn-lg rounded-pill px-5 sign-in-button"
      >
        ${content}
        <img src="asset/42logo.png" style="max-width: 2rem; height: auto;"/>
      </button>
    `;
  }

  mounted() {
    if (this.props.type === "button") {
      const { id, onClickHandler } = this.props;

      this.addEvent("click", `#${id}`, onClickHandler);
    }
  }
}
