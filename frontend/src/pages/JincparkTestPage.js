import Component from "../core/Component.js";
// import LoginForm from "../components/Login/LoginForm.js";
import SignUpForm from "../components/SignUp/SignUpForm.js";

export default class JincparkTestPage extends Component {
  template() {
    return `<h1>Jincpark's Component Test Page</h1><div id="test">`;
  }

  mounted() {
    const $div = this.$target.querySelector("#test");

    // const loginForm = new LoginForm($div);
    const signupForm = new SignUpForm($div);

    // loginForm.render();
    signupForm.render();
  }
}
