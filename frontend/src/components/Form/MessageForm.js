import Component from "../../core/Component.js";
import Input from "../UI/Input/Input.js";

export default class MessageForm extends Component {
  template() {
    return `
    <form class="d-flex align-items-center position-relative z-0">
      <div id="${this.props.id}-holder"></div>
      <img
        src="asset/sendIcon.svg"
        alt="send message"
        class="position-absolute z-1 end-0 me-3"
      />
    </form>`;
  }

  mounted() {
    const { id, name } = this.props;
    const inputProps = {
      type: "text",
      id,
      name,
      placeholder: "Type a message ...",
      required: true,
      className: "form-control-lg pe-5",
    };
    const input = new Input(
      this.$target.querySelector(`#${id}-holder`),
      inputProps
    );
    input.render();
  }
}
