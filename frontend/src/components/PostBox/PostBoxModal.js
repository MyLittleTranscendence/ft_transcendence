import Component from "../../core/Component.js";
import PostList from "./PostList.js";

export default class PostBoxModal extends Component {
  template() {
    return `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Message</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
            <div id="post-list-holder" class="modal-body"></div>
        </div>
      </div>
    `;
  }

  mounted() {
    const postList = new PostList(
      this.$target.querySelector("#post-list-holder"),
      {},
      this
    );

    postList.render();
  }
}
