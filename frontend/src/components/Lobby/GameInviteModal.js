import Modal from "../UI/Modal/Modal.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import Button from "../UI/Button/Button.js";
import { gameSocket } from "../../socket/socketManager.js";

export default class GameInviteModal extends Modal {
  setEvent() {
    this.addEvent("click", "#accept-btn", () => {
      const { sendSocket } = gameSocket();
      sendSocket("response_invite", {
        inviter_user_id: this.props.challengerUserId,
      });
      this.$target.innerHTML = "";
    });
    this.addEvent("click", "#deny-btn", () => {
      this.$target.innerHTML = "";
    });
  }

  mounted() {
    const { challengerNickname, challengerProfileImage } = this.props;

    this.$modalTitle.textContent = "Challange requested!";

    const challangerImage = new ProfileImage(this.$userImageHolder, {
      imageSrc: challengerProfileImage,
      imageSize: "image-mid",
    });
    challangerImage.render();

    this.$textContent.textContent = `${challengerNickname} has requested you 1 vs 1.`;

    const $acceptButtonHolder = document.createElement("div");
    $acceptButtonHolder.className = "me-3";
    const $denyButtonHolder = document.createElement("div");

    this.$modalButtonGroup.appendChild($acceptButtonHolder);
    this.$modalButtonGroup.appendChild($denyButtonHolder);

    const acceptButton = new Button($acceptButtonHolder, {
      id: "accept-btn",
      content: "Accept",
    });
    const denyButton = new Button($denyButtonHolder, {
      id: "deny-btn",
      content: "Deny",
      className: "cancle-button",
    });
    acceptButton.render();
    denyButton.render();
  }
}
