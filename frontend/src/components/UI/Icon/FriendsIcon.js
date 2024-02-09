import Component from "../../../core/Component.js";

export default class FriendsIcon extends Component {
  template() {
    return `
    <a
      tabindex="0"
      class="btn"
      role="button"
      data-bs-toggle="popover"
      data-bs-placement="left"
    >
      <img src="asset/icon_people.svg">
    </a>
      ${
        this.props.isOnline
          ? `
      <div
        class="
          position-absolute
          bottom-0 start-100
          badge
          border border-primary border-3 rounded-pill
        "
        style="
          background-color: #00FF38;
          width: 1.5rem;
          height: 1.5rem;
          transform: translate(-130%, 17%);
        "
      />`
          : ""
      }
    `;
  }

  mounted() {
    var popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new bootstrap.Popover(popoverTriggerEl, {
        html: true,
        title: "<span class='d-flex justify-content-center'>Friends</span>",
        content: "This place will be list of friends. Comming Soon!",
      });
    });
  }
}
