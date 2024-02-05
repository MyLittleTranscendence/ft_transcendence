import Component from "../../../core/Component.js";
import ProfileImage from "./ProfileImage.js";
import Overview from "./Overview.js";

export default class Profile extends Component {
  template() {
    const {
      username,
    } = this.props;

    return `
		<div
			id="profile-container"
			class="d-flex flex-column align-items-center"
		>
			<h2
				class="text-white"
				style="font-weight: bold;"
			>
				${username}'s Profile
			</h2>
			<div id="profile-image-content"></div>
			<h5 class="text-warning">${username}</h5>
			<br>
			<div id="overview-content"></div>
		</div>
    `;
  }

	mounted() {
		const {
			imageSize,
			imageSrc,
			alt,
			wins,
			losses,
		} = this.props;

		const $profileContainer = this.$target.querySelector(
			"#profile-container"
		);
		const $profileImageContent = $profileContainer.querySelector(
			"#profile-image-content"
		);
		const $overviewContent = $profileContainer.querySelector(
			"#overview-content"
		);

		const profileImage = new ProfileImage($profileImageContent, {
			imageSize,
			imageSrc,
			alt,
		});
		const overview = new Overview($overviewContent, {
			wins,
			losses,
		})
		profileImage.render();
		overview.render();
	}
}
