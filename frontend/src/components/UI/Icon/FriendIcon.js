import Component from "../../../core/Component.js";
import OnlineIcon from "./OnlineIcon.js";

export default class FriendIcon extends Component {
  template() {
    return `
      <div
        type="button"
        class="
          position-relative
          d-flex justify-content-center
        "
        data-bs-toggle="modal"
        data-bs-target="#friend-list-modal"
      >
        <img src="asset/icon_people.svg">
        <div id="online-icon-holder"></div>
      </div>
    `;
  }

  mounted() {
    const onlineIcon = new OnlineIcon(
      this.$target.querySelector("#online-icon-holder")
    );

    onlineIcon.render();
  }
}
