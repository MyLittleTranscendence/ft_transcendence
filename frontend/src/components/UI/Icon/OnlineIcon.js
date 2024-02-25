import Component from "../../../core/Component.js";

export default class OnlineIcon extends Component {
  template() {
    return `
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
      ></div>
    `;
  }
}
