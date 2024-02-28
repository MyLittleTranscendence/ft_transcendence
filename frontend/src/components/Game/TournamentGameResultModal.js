import Modal from "../UI/Modal/Modal.js";
import Button from "../UI/Button/Button.js";
import Link from "../UI/Link/Link.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import fetchUserInfo from "../../api/user/fetchUserInfo.js";

export default class TournamentGameResultModal extends Modal {
  async setup() {
    if (this.props.isFinal) {
      this.state = { winnerInfo: null };
      const winnerInfo = await fetchUserInfo(this.props.winner);
      this.setState({ winnerInfo });
    }
  }

  mounted() {
    if (this.props.isFinal) {
      this.$modalTitle.textContent = "Winner of The Tournament";

      const { winnerInfo } = this.state;

      const winnerImage = new ProfileImage(this.$userImageHolder, {
        userId: winnerInfo ? winnerInfo.userId : null,
        imageSize: "image-mid",
        imageSrc: winnerInfo ? winnerInfo.profileImage : null,
        alt: `${winnerInfo ? winnerInfo.nickname : ""}\`s profile`,
      });
      winnerImage.render();

      this.$textContent.textContent = winnerInfo
        ? winnerInfo.nickname
        : "Loading...";

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
          : "Sorry, You Lost.";

      const confirmButton = new Button(this.$modalButtonGroup, {
        id: "modal-close",
        content: "Confirm",
      });
      confirmButton.render();
    }
  }
}
