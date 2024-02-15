import Component from "../../core/Component.js";

export default class FriendsList extends Component {
  template() {
    const { friends } = this.props;
    return `
      <div
        class="list-group list-group-flush"
      >
        <div id="friends-list-holder">
        ${friends.map(
          (friend) => `
            <div
              class="list-group-item"
            >
              <div>
                <img
                  src=${friend.profile_image}
                  class="img-fluid rounded-circle"
                  alt="default"
                >
              </div>
              <span>
                <button class="btn">${friend.nickname}</button>
              </span>
            </div>`
        )}
        </div>
      </div>
    `;
  }
}
