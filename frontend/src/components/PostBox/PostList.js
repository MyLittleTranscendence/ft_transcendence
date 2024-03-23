import Component from "../../core/Component.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
// import NewIcon from "../UI/Icon/NewIcon.js";
import { newSingleMessageHandler } from "../../handlers/chat/chatHandler.js";
import { postListStore } from "../../store/initialStates.js";
import { directMessageUserIdStore } from "../../store/initialStates.js";

export default class PostList extends Component {
  setup() {
    postListStore.subscribe(this);
  }

  setEvent() {
    this.addEvent("click", ".dm-trigger", (e) => {
      const $target = e.target.closest(".dm-trigger");
      directMessageUserIdStore.setState({
        userId: parseInt($target.getAttribute("data-user-id"), 10),
      });
    });
    newSingleMessageHandler(this.removeObservers);
  }

  template() {
    const { users } = postListStore.getState();

    if (users.length === 0) {
      return `
        <div class="d-flex justify-content-center">
          <h4 class="fw-bold g-light-grey">No messages.</h4>
        </div>
      `;
    }
    return `
      <div class="list-group list-group-flush">
        ${users
          .map(
            (user) => `
              <div
                class="
                  list-group-item
                  list-group-item-action
                  d-flex
                  align-items-center
                  px-0
                  border-0
                  dm-trigger
                "
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#dm-modal"
                data-user-id="${user.userId}"
              >
                <div class="position-relative">
                  <div id="user-profile-${user.userId}"></div>
                  <div id="new-icon-${user.userId}"></div>
                </div>
                <span class="mx-3">
                  <h5 class="fw-bold mb-1">${user.nickname}</h5>
                  <small class="g-light-grey">click here to send message</small>
                </span>
              </div>
          `
          )
          .join("")}
      </div>
    `;
  }

  mounted() {
    const { users } = postListStore.getState();

    if (users.length > 0) {
      users.forEach((user) => {
        const userProfile = new ProfileImage(
          this.$target.querySelector(`#user-profile-${user.userId}`),
          {
            imageSize: "image-sm",
            imageSrc: user.ProfileImage,
            alt: user.nickname,
          }
        );
        userProfile.render();

        // if (user.newMessage) {
        //   const newIcon = new NewIcon(
        //     this.$target.querySelector(`#new-icon-${user.userId}`)
        //   );
        //   newIcon.render();
        // }
      });
    }
  }
}
