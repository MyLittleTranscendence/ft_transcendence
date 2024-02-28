import Component from "../../../core/Component.js";

export default class OnlineIcon extends Component {
  template() {
    return `
      <div
        class="
          d-block
          position-absolute
          bottom-0 start-100
          badge
          border rounded-pill
        "
        style="
          background-color: #00FF38;
          width: 1rem;
          height: 1rem;
          transform: translate(-130%, 17%);
        "
      ></div>
    `;
  }
}
