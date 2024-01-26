import Component from "../core/Component.js";
import LoginForm from "../components/Login/LoginForm.js";

export default class JincparkTestPage extends Component {
  template() {
    return `<h1>Jincpark's Component Test Page</h1><div id="test">`;
  }

  mounted() {
    const loginForm = new LoginForm(this.$target.querySelector("#test"));
    loginForm.render();
  }
}
