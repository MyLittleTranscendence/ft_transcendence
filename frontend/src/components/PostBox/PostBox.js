import Component from "../../core/Component.js";
import PostBoxIcon from "../UI/Icon/PostBoxIcon.js";
import PostBoxModal from "./PostBoxModal.js";

export default class PostBox extends Component {
  template() {
    return `
      <div id="postbox-icon-holder"></div>
      <div id="postbox-modal" class="modal fade"></div>
    `;
  }

  mounted() {
    const postboxIcon = new PostBoxIcon(
      this.$target.querySelector("#postbox-icon-holder")
    );
    const postboxModal = new PostBoxModal(
      this.$target.querySelector("#postbox-modal")
    );

    postboxIcon.render();
    postboxModal.render();
  }
}
