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
    this.$winnerImgaeHolder = this.$target.querySelector(
      "#winner-image-holder"
    );
    this.$winnerNickname = this.$target.querySelector("#winner-nickname");
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
            text-white fw-bold
            bg-primary"
          style="width: 30rem; height: 23rem;"
        >
          <div id="modal-content" class="fs-3 d-flex flex-column align-items-center text-center mb-2"></div>
          <div id="winner-image-holder"></div>
          <div id="winner-nickname" class="fs-4"></div>
          <br>
          <div id="modal-btn-group" class="d-flex align-items-center justify-content-evenly"></div>
        </div>
      </div>
    `;
  }
}
