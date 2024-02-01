import Component from "../../core/Component.js";
import appendCSSLink from "../../utils/appendCSSLink.js";

appendCSSLink("src/components/UI/BouncingBallOnRacket.css");

export default class BouncingBallOnRacket extends Component {
  template() {
    return `
      <div
        class="position-relative"
        style="width: 7rem; height: auto;"
      >
        <div
          class="
            position-absolute
            border rounded-circle border-dark
            bg-warning
            pingpong-ball
            ${this.props.findingMatch ? "bouncing" : ""}
            "
        ></div>
        <img src="asset/pingpong_racket.png" class="img-fluid" alt="pingpong racket">
      </div>
    `;
  }
}
