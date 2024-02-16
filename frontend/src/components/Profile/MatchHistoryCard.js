import Component from "../../core/Component.js";
import appendCSSLink from "../../utils/appendCSSLink.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";

appendCSSLink("src/components/Profile/MatchHistoryCard.css");

export default class MatchHistoryCard extends Component {
  template() {
    const { props } = this.props;

    return `
      <div class="card match-history-card">
        <div class="card-header card-header-custom">
          ${props.game_type}
        </div>
        <div class="card-body card-body-custom">
            <div
              class="${props.isWin ? "match-history-win" : "match-history-lost"}
              match-history-blank">
              ${props.isWin ? "Win" : "Lost"}
            </div>
            <div id="left-profile-image" class="match-history-image"></div>
            <div class="match-history-username">${props.left_user.nickname}</div>
            <div class="match-history-versus">vs</div>
            <div class="match-history-username">${props.right_user_nickname}</div>
            <div id="right-profile-image" class="match-history-image"></div>
            <div class="match-history-blank"></div>
        </div>
        <div class="card-footer card-footer-custom">
          ${props.left_score} : ${props.right_score}
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
      imageSize: "image-sm",
      imageSrc: `${this.props.left_user.profile_image}`,
      alt: `${this.props.left_user.nickname}`,
    });
    const rightProfileImage = new ProfileImage($rightProfileImageContent, {
      imageSize: "image-sm",
      imageSrc: `${this.props.right_user.profile_image}`,
      alt: `${this.props.right_user.nickname}`,
    });

    leftProfileImage.render();
    rightProfileImage.render();
  }
}
