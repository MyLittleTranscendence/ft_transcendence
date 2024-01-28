import Component from "../../../core/Component.js";

export default class PageContainerWithLogo extends Component {
  constructor($target, $content, props, state) {
    super($target, props, state);
    this.$content = $content;
  }

  template() {
    return `
      <div
        id="page-container-with-logo"
        class="container mt-5 p-5 border border-white border-5 position-relative"
      >
        <img
          src="medium-logo.png"
          class="position-absolute top-0 start-50 translate-middle"
        />
      </div>
    `;
  }

  mounted() {
    const $container = this.$target.querySelector("#page-container-with-logo");
    $container.appendChild(this.$content);
  }
}
