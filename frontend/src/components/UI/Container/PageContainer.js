import Component from "../../../core/Component.js";

export default class PageContainer extends Component {
  constructor($target, $content, props, state) {
    super($target, props, state);
    this.$content = $content;
  }

  template() {
    return `
      <div
        id="page-container"
        class="container mt-5 p-5 border border-white border-5"
      ></div>
    `;
  }

  mounted() {
    const $container = this.$target.querySelector("#page-container");
    $container.appendChild(this.$content);
  }
}
