import Component from "../../../core/Component.js";
// import OnlineIcon from "./OnlineIcon.js";
// import { friendOnlineStatusStore } from "../../../store/initialStates.js";

export default class PostBoxIcon extends Component {
  setup() {
    // friendOnlineStatusStore.subscribe(this);
  }

  template() {
    return `
      <div
        type="button"
        class="
          position-relative
          d-flex justify-content-center
        "
        data-bs-toggle="modal"
        data-bs-target="#postbox-message-list-modal"
      >
        <img src="asset/icon_people.svg">
        <div id="online-icon-holder"></div>
      </div>
    `;
  }

  mounted() {
    // const { onlineStatus } = friendOnlineStatusStore.getState();
    // if (Object.values(onlineStatus).some((status) => status === 1)) {
    //   const onlineIcon = new OnlineIcon(
    //     this.$target.querySelector("#online-icon-holder")
    //   );
    //   onlineIcon.render();
    // }
  }
}
