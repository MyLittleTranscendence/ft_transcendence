import Component from "../../core/Component.js";
import appendCSSLink from "../../utils/appendCSSLink.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";

appendCSSLink("src/components/Profile/MatchHistoryCard.css");

export default class MatchHistoryCard extends Component {
  template() {
    const { win, username, opponent, score } = this.props;

    return `
      <div class="card match-history-card">
        <div class="card-header ${win ? "match-history-win" : "match-history-lose"}">
          ${win ? "Win" : "Lose"}
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-center align-items-center">
            <div id="user-profile-image"></div>
            <span class="mx-2">
              ${username} vs ${opponent}
            </span>
            <div id="opponent-profile-image"></div>
          </div>
        </div>
        <div class="card-footer bg-transparent border-0">
          ${score}
        </div>
      </div>
    `;
  }

  mounted() {
    const $userProfileImageContent = this.$target.querySelector(
      "#user-profile-image"
    );
    const $opponentProfileImageContent = this.$target.querySelector(
      "#opponent-profile-image"
    );
    const userProfileImage = new ProfileImage($userProfileImageContent, {
      imageSize: "image-sm",
      imageSrc: "asset/default.png",
      alt: "my profile",
    });
    const opponentProfileImage = new ProfileImage(
      $opponentProfileImageContent,
      {
        imageSize: "image-sm",
        imageSrc: "asset/default.png",
        alt: "my profile",
      }
    );
    userProfileImage.render();
    opponentProfileImage.render();
  }
}
