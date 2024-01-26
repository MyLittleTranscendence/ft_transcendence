import Input from "../components/UI/Input.js";
import Component from "../core/Component.js";

export default class JincparkTestPage extends Component {
  template() {
    return `<h1>Jincpark's Component Test Page</h1><div id="test">`;
  }

  mounted() {
    const component = new Input(this.$target.querySelector("#test"), {
      type: "text",
      id: "input test",
      name: "name is for identifying this form when POST",
      className: "",
      placeholder: "hello world",
      autocomplete: true,
    });
    component.render();
  }
}
