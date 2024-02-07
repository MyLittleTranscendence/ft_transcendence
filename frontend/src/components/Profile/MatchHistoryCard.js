import Component from "../../core/Component.js";
import appendCSSLink from "../../utils/appendCSSLink.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";

appendCSSLink("src/components/Profile/MatchHistoryCard.css");

export default class MatchHistoryCard extends Component {
  template() {
    const { matchtype, win, username, opponent, score } = this.props;

    return `
      <div class="card match-history-card">
        <div class="card-header card-header-custom">
          ${matchtype}
        </div>
        <div class="card-body card-body-custom">
            <div
              class="${win ? "match-history-win" : "match-history-lost"}
              match-history-blank">
              ${win ? "Win" : "Lost"}
            </div>
            <div id="user-profile-image" class="match-history-image"></div>
            <div class="match-history-username">${username}</div>
            <div class="match-history-versus">vs</div>
            <div class="match-history-username">${opponent}</div>
            <div id="opponent-profile-image" class="match-history-image"></div>
            <div class="match-history-blank"></div>
        </div>
        <div class="card-footer card-footer-custom">
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
