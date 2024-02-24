import Component from "../../core/Component.js";
import { blockListStore } from "../../store/initialStates.js";

export default class BlockList extends Component {
  setup() {
    const unsubscribe = blockListStore.subscribe(this);
    this.removeObservers.push(unsubscribe);
  }

  template() {
    const blocks = blockListStore.getState().blocks;

    if (blocks.length === 0) {
      return `
        <div class="d-flex justify-content-center">
          <h4 class="fw-bold g-light-grey">No blocked users.</h4>
        </div>
      `;
    }

    return `
      <div
        class="list-group list-group-flush"
      >
        ${blocks
          .map(
            (block) => `
            <div
              class="dropdown dropend"
            >
              <div
                class="
                  list-group-item
                  list-group-item-action
                  d-flex
                  align-items-center
                  dropdown-toggle
                "
                type="button"
                data-bs-toggle="dropdown"
              >
                <div
                  class="overflow-hidden rounded-circle"
                  style="width: 4rem; height: 4rem;"
                >
                  <img
                    src=${block.profile_image}
                    class="img-fluid"
                    alt="default"
                  >
                </div>
                <span
                  class="mx-3"
                >
                  <h5 class="fw-bold mb-1">${block.nickname}</h5>
                  <small class="g-light-grey">click here to send message</small>
                </span>
              </div>
              <ul class="dropdown-menu" data-user-id="${block.user_id}" data-sub-id=${block.block_id}>
                <li><a
                  href="/profile?user_id=${block.user_id}"
                  class="dropdown-item"
                  data-bs-dismiss="modal"
                  data-link
                  >
                    Profile
                </a></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item text-primary">Unblock</button></li>
              </ul>
            </div>
          `
          )
          .join("")}
      </div>
    `;
  }
}
