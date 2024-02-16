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
        class="
          container
          mt-5 p-5
          border border-white border-5
          position-relative
        "
      >
        <a
          href="/"
          class="
            position-absolute
            top-0 start-50
            translate-middle
            ps-5 pe-5
            bg-primary
          "
          style="width: 18rem; height: auto;"
        >
          <img
            src="asset/logo-medium.png"
            class="img-fluid"
          />
        </a>
      </div>
    `;
  }

  mounted() {
    const $container = this.$target.querySelector("#page-container-with-logo");
    $container.appendChild(this.$content);
  }
}
