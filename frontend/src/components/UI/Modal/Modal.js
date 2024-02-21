import Component from "../../../core/Component.js";

export default class Modal extends Component {
  setEvent() {
    this.addEvent("click", "#modal-close", () => {
      this.$target.innerHTML = "";
    });
  }

  render() {
    this.$target.innerHTML = this.template();
    this.$modalContent = this.$target.querySelector("#modal-content");
    this.$modalButtonGroup = this.$target.querySelector("#modal-btn-group");
    this.mounted();
  }

  template() {
    return `
      <div
        class="
          position-absolute start-0 top-0 
          vw-100 vh-100
          d-flex align-items-center justify-content-center"
        style="background-color: rgba(0, 0, 0, 0.5)"
        >
        <div
          id="modal-container"
          class="
            border border-white border-3
            d-flex flex-column align-items-center justify-content-center
            bg-primary"
          style="width: 30rem; height: 23rem;"
        >
          <div id="modal-content" class="text-white fs-1 fw-bold"></div>
          <br>
          <div id="modal-btn-group" class="d-flex align-items-center justify-content-evenly"></div>
        </div>
      </div>
    `;
  }
}
