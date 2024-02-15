import Component from "../../core/Component.js";

export default class FriendsList extends Component {
  template() {
    const { friends } = this.props;
    return `
      <div
        class="list-group list-group-flush"
      >
        ${friends.map(
          (friend) => `
            <div
              id="chat-trigger"
              data-friend-${friend.user_id}
              class="list-group-item d-flex align-items-center"
              style="min-width: 20rem;"
            >
              <div
                class="overflow-hidden rounded-circle"
                style="width: 4rem; height: 4rem;"
              >
                <img
                  src=${friend.profile_image}
                  class="img-fluid"
                  alt="default"
                >
              </div>
              <span
                class="mx-3"
              >
                <h5 class="mb-1">${friend.nickname}</h5>
                <small class="g-light-grey">click here to send message</small>
              </span>
            </div>
          `
        )}
      </div>
    `;
  }
}
