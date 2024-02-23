import Modal from "../UI/Modal/Modal.js";
import Link from "../UI/Link/Link.js";

export default class SingleGameResultModal extends Modal {
  mounted() {
    this.$modalContent.textContent = "Match is over";
    const goHomeLink = new Link(this.$modalButtonGroup, {
      id: "modal-close",
      href: "/",
      content: "Home",
    });
    goHomeLink.render();
  }
}
