import Component from "../../core/Component.js";
import appendCSSLink from "../../utils/appendCSSLink.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";

appendCSSLink("src/components/Profile/MatchHistoryCard.css");

export default class MatchHistoryCard extends Component {
  template() {
    return `
      <div class="card match-history-card">
        <div class="card-header card-header-custom">
          ${this.props.game_type}
        </div>
        <div class="card-body card-body-custom">
            <div
              class="${this.props.isWin ? "match-history-win" : "match-history-lost"}
              match-history-blank">
              ${this.props.isWin ? "Win" : "Lost"}
            </div>
            <div id="left-profile-image" class="match-history-image"></div>
            <div class="match-history-username">${this.props.left_user.nickname}</div>
            <div class="match-history-versus">vs</div>
            <div class="match-history-username">${this.props.right_user.nickname}</div>
            <div id="right-profile-image" class="match-history-image"></div>
            <div class="match-history-blank"></div>
        </div>
        <div class="card-footer card-footer-custom">
          ${this.props.left_score} : ${this.props.right_score}
        </div>
      </div>
    `;
  }

  mounted() {
    const $leftProfileImageContent = this.$target.querySelector(
      "#left-profile-image"
    );
    const $rightProfileImageContent = this.$target.querySelector(
      "#right-profile-image"
    );

    const leftProfileImage = new ProfileImage($leftProfileImageContent, {
      userId: this.props.left_user.id,
      imageSize: "image-sm",
      imageSrc: `${this.props.left_user.profile_image}`,
      alt: `${this.props.left_user.nickname}`,
    });
    const rightProfileImage = new ProfileImage($rightProfileImageContent, {
      userId: this.props.right_user.id,
      imageSize: "image-sm",
      imageSrc: `${this.props.right_user.profile_image}`,
      alt: `${this.props.right_user.nickname}`,
    });

    leftProfileImage.render();
    rightProfileImage.render();
  }
}
