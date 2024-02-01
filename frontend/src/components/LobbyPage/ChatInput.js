import Component from "../../core/Component.js";
import Input from "../UI/Input/Input.js";

export default class ChatInput extends Component {
  template() {
    return `
    <div class="
      d-flex align-items-center
      position-relative
      w-100
    ">
      <div id="${this.props.id}-holder" class="w-100"></div>
      <img
        src="asset/sendIcon.svg"
        alt="send message"
        class="position-absolute z-1 end-0 me-3"
      />
    </div>`;
  }

  mounted() {
    const { id, name } = this.props;
    const inputProps = {
      type: "text",
      id,
      name,
      placeholder: "Type a message ...",
      required: true,
      className: "form-control-lg pe-5 w-100",
    };
    const input = new Input(
      this.$target.querySelector(`#${id}-holder`),
      inputProps
    );
    input.render();
  }
}
