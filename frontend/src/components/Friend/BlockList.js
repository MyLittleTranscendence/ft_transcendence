import Component from "../../core/Component.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import { blockListStore } from "../../store/initialStates.js";
import unblockUserHandler from "../../handlers/user/unblockUserHandler.js";

export default class BlockList extends Component {
  setup() {
    const unsubscribe = blockListStore.subscribe(this);
    this.removeObservers.push(unsubscribe);
  }

  setEvent() {
    this.addEvent("click", "#unblock-trigger", (e) => {
      unblockUserHandler(parseInt(e.target.getAttribute("data-user-id"), 10));
    });
  }

  template() {
    const { blocks } = blockListStore.getState();

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
                <div id="block-profile-${block.userId}"></div>
                <span
                  class="mx-3"
                >
                  <h5 class="fw-bold mb-1">${block.nickname}</h5>
                  <small class="g-light-grey">click here to send message</small>
                </span>
              </div>
              <ul class="dropdown-menu" data-user-id="${block.userId}">
                <li><a
                  href="/profile?user_id=${block.userId}"
                  class="dropdown-item"
                  data-bs-dismiss="modal"
                  data-link
                  >
                    Profile
                </a></li>
                <li><hr class="dropdown-divider"></li>
                <li><button
                  id="unblock-trigger"
                  class="dropdown-item text-primary"
                  data-bs-dismiss="modal"
                  data-user-id="${block.userId}"
                >Unblock</buttonclass=></li>
              </ul>
            </div>
          `
          )
          .join("")}
      </div>
    `;
  }

  mounted() {
    const { blocks } = blockListStore.getState();

    if (blocks.length > 0) {
      blocks.forEach((block) => {
        const blockProfile = new ProfileImage(
          this.$target.querySelector(`#block-profile-${block.userId}`),
          {
            imageSize: "image-sm",
            imageSrc: block.profileImage,
            alt: "/asset/default.png",
          }
        );
        blockProfile.render();
      });
    }
  }
}
