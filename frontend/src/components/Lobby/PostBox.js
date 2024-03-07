import Component from "../../core/Component.js";
import PostBoxIcon from "../UI/Icon/PostBoxIcon.js";

export default class PostBox extends Component {
  template() {
    return `
      <div id="postbox-icon-holder"></div>
    `;
  }

  mounted() {
    const postboxIcon = new PostBoxIcon(
      this.$target.querySelector("#postbox-icon-holder")
    );

    postboxIcon.render();
  }
}
