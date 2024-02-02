import Component from "../core/Component.js";
// import LoginForm from "../components/Login/LoginForm.js";
// import SignUpForm from "../components/SignUp/SignUpForm.js";
// import ChatInput from "../components/Lobby/ChatInput.js";
import TwoFAForm from "../components/SignIn/TwoFAForm.js";

export default class JincparkTestPage extends Component {
  template() {
    return `
      <div class="d-flex flex-column">
        <h1>Test Page</h1>
        <div id="test" class="mt-5"></div>
      </div>`;
  }

  mounted() {
    const $div = this.$target.querySelector("#test");

    // const loginForm = new LoginForm($div);
    // const signupForm = new SignUpForm($div);
    // const messageInput = new MessageForm($div, {
    //   id: "message-input-test",
    //   name: "message-input",
    // });

    // loginForm.render();
    // signupForm.render();
    // messageInput.render();

    const verifyForm = new TwoFAForm($div);
    verifyForm.render();
  }
}
