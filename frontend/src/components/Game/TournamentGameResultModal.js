import Modal from "../UI/Modal/Modal.js";
import Button from "../UI/Button/Button.js";
import Link from "../UI/Link/Link.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import fetchUserInfo from "../../api/user/fetchUserInfo.js";

export default class TournamentGameResultModal extends Modal {
  async mounted() {
    if (this.props.isFinal) {
      const { winner } = this.props;

      this.$modalTitle.textContent = "Winner of The Tournament";

      const winnerInfo = await fetchUserInfo(winner);

      const winnerImage = new ProfileImage(this.$userImgaeHolder, {
        imageSize: "image-mid",
        imageSrc: winnerInfo.profileImage,
      });
      winnerImage.render();

      this.$textContent.textContent = winnerInfo.nickname;

      const goHomeLink = new Link(this.$modalButtonGroup, {
        id: "modal-close",
        href: "/",
        content: "Home",
      });
      goHomeLink.render();
    } else {
      this.$modalTitle.innerHTML =
        this.props.winner === this.props.myId
          ? "<div>Congrats, You Won!</div><div>Get Ready for the final match.</div>"
          : "Sorry, You Lose.";

      const confirmButton = new Button(this.$modalButtonGroup, {
        id: "modal-close",
        content: "Confirm",
      });
      confirmButton.render();
    }
  }
}
