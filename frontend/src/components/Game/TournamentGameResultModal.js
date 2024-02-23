import Modal from "../UI/Modal/Modal.js";
import Button from "../UI/Button/Button.js";
import Link from "../UI/Link/Link.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import fetchUserInfo from "../../api/user/fetchUserInfo.js";

export default class TournamentGameResultModal extends Modal {
  async mounted() {
    if (this.props.isFinal) {
      const { winner } = this.props;

      this.$modalContent.textContent = "Winner of The Tournament";

      const winnerInfo = await fetchUserInfo(winner);

      const winnerImage = new ProfileImage(this.$winnerImgaeHolder, {
        imageSize: "image-mid",
        imageSrc: winnerInfo.profileImage,
      });
      winnerImage.render();

      this.$winnerNickname.textContent = winnerInfo.nickname;

      const goHomeLink = new Link(this.$modalButtonGroup, {
        id: "modal-close",
        href: "/",
        content: "Home",
      });
      goHomeLink.render();
    } else {
      this.$modalContent.innerHTML =
        this.props.winner === this.props.myId
          ? "<div>Congrats, You Won!</div><div>Get Ready for the final match.</div>"
          : "Sorry, You Lost.";

      const confirmButton = new Button(this.$modalButtonGroup, {
        id: "modal-close",
        content: "Confirm",
      });
      confirmButton.render();
    }
  }
}
