import Modal from "../UI/Modal/Modal.js";
import Link from "../UI/Link/Link.js";

export default class MultiGameResultModal extends Modal {
  mounted() {
    this.$modalTitle.textContent = this.props.isWin
      ? "Congrats, You Won!"
      : "Sorry, You Lose.";
    const goHomeLink = new Link(this.$modalButtonGroup, {
      id: "modal-close",
      href: "/",
      content: "Home",
    });
    goHomeLink.render();
  }
}
