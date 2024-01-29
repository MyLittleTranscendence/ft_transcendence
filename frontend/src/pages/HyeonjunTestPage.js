import Component from "../core/Component.js";
import Button from "../components/UI/Button/Button.js";

export default class SignUpPage extends Component {
  template() {
    return '<div><h1>Hyeonjun Test Page</h1><div id="signin"></div><div id="signup"></div><div id="loading"></div><div id="send"></div><div id="confirm"></div><div id="goback"></div>';
  }

  mounted() {
    const signInButtonProps = {
      disabled: true,
      content: "Sign In",
      loading: false,
      small: false,
    };
    const signUpButtonProps = {
      disabled: false,
      content: "Sign Up",
      loading: false,
      small: false,
    };
    const loadingButtonProps = {
      disabled: false,
      content: "",
      loading: true,
      small: false,
    };
    const sendVerificationButtonProps = {
      disabled: true,
      content: "Send verification code",
      loading: false,
      small: true,
    };
    const sendAgainButtonProps = {
      disabled: false,
      content: "Send again",
      loading: false,
      small: true,
    };
    const confirmButtonProps = {
      disabled: true,
      content: "Confirm",
      loading: false,
      small: false,
    };
    const goBackButtonProps = {
      disabled: false,
      content: "Go Back",
      loading: false,
      small: false,
    };

    const signInButton = new Button(
      this.$target.querySelector("#signin"),
      signInButtonProps
    );
    const signUpButton = new Button(
      this.$target.querySelector("#signup"),
      signUpButtonProps
    );
    const loadingButton = new Button(
      this.$target.querySelector("#loading"),
      loadingButtonProps
    );
    const sendVerificationButton = new Button(
      this.$target.querySelector("#send"),
      sendVerificationButtonProps
    );
    const sendAgainButton = new Button(
      this.$target.querySelector("#send"),
      sendAgainButtonProps
    );
    const confirmButton = new Button(
      this.$target.querySelector("#confirm"),
      confirmButtonProps
    );
    const goBackButton = new Button(
      this.$target.querySelector("#goback"),
      goBackButtonProps
    );

    signInButton.render();
    signUpButton.render();
    loadingButton.render();
    sendVerificationButton.render();
    sendAgainButton.render();
    confirmButton.render();
    goBackButton.render();
  }
}
