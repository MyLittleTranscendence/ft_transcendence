import Component from "../../core/Component.js";
import BlockList from "./BlockList.js";

export default class BlockListModal extends Component {
  template() {
    return `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">Block</h4>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div id="block-list-holder" class="modal-body"></div>
          <div class="modal-footer">
            <button
              class="btn"
              data-bs-target="#friend-list-modal"
              data-bs-toggle="modal"
            >Friend</button>
          </div>
        </div>
      </div>
    `;
  }

  mounted() {
    const blockList = new BlockList(
      this.$target.querySelector("#block-list-holder"),
      this
    );

    blockList.render();
  }
}
