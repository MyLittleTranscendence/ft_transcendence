import Component from "../../../core/Component.js";
import appendCSSLink from "../../../utils/appendCSSLink.js";

appendCSSLink("src/components/UI/Link/Link.css");

export default class Link extends Component {
  template() {
    const { id, href, small, content, className, attributes } = this.props;

    return `
      <a
        ${id ? `id=${id}` : ""}
        href="${href}"
        class="
          btn rounded-pill link
          ${className ? `${className}` : ""}
          ${small ? "btn-sm" : "btn-lg"}
        "
        ${attributes || ""}
        data-link
      >
        ${content}
      </a>
    `;
  }
}
