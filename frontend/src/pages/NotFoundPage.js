import Component from "../core/Component.js";

export default class NotFoundPage extends Component {
  template() {
    return `
    <div
      class="container
      d-flex align-items-center flex-column p-5 m-5
      border border-white border-5"
    >
        <img
          src="asset/404.png"
          class="img-fluid mb-4"
          style="max-width: 30rem; width: 100%;"
        >
        <h1 class="text-center fw-bold text-white">Page Not Found</h1>
    </div>
    `;
  }
}
