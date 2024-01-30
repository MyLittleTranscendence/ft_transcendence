import Component from "../../../core/Component.js";
import appendCSSLink from "../../../utils/appendCSSLink.js";

appendCSSLink("src/components/UI/Profile/ProfileImage.css");

export default class ProfileImage extends Component {
  template() {
	const {
		imageSize, // image-big, image-mid, image-sm
		imageSrc,
		alt,
	} = this.props;

  	return `
		<img class="img-fluid rounded-circle ${imageSize}" src=${imageSrc} alt=${alt}>
    `;
  }
}