import Component from "../../core/Component.js";
import appendCSSLink from "../../utils/appendCSSLink.js";

appendCSSLink("src/components/Toast/Toast.css");

export default class Toast extends Component {
  template() {
    return `
      <div
        id="toast-content"
        class="
          border
          border-4
          border-warning
          rounded-pill
          bg-white
          fw-bold
          text-center
          py-2
          px-5
        "
      >
      </div>
    `;
  }

  mounted() {
    this.$toastContent = this.$target.querySelector("#toast-content");
  }

  show(content) {
    this.$toastContent.textContent = content;
    this.$toastContent.classList.add("show");
    setTimeout(() => {
      this.$toastContent.classList.remove("show");
    }, 4500);
  }
}
