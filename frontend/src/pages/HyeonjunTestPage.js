import Component from "../core/Component.js";
import Button from "../components/UI/Button/Button.js";

export default class SignUpPage extends Component {
  template() {
    return '<div><h1>Hyeonjun Test Page</h1><div id="button"></div></div>';
  }

  mounted() {
    const buttonProps = {
      disabled: false,
      name: "Sign Up",
      loading: false,
      small: false,
    };
    const button = new Button(
      this.$target.querySelector("#button"),
      buttonProps
    );
    // button.setState({ disabled: true });
    button.render();
  }
}
