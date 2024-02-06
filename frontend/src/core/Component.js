export default class Component {
  $target;

  props;

  state;

  constructor($target, props) {
    this.$target = $target;
    this.props = props;
    this.setup();
    this.setEvent();
  }

  setup() {} // 컴포넌트 state 설정

  mounted() {}

  template() {
    return "";
  }

  render() {
    if (this.$target.id === "app") {
      this.$target.innerHTML = this.template();
    } else {
      const fragment = document.createDocumentFragment();
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = this.template();

      while (tempDiv.firstChild) {
        fragment.appendChild(tempDiv.firstChild);
      }
      this.$target.appendChild(fragment);
    }
    this.mounted();
  }

  setEvent() {} // 컴포넌트에서 필요한 이벤트 설정

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  addEvent(eventType, selector, callback) {
    this.$target.addEventListener(eventType, (event) => {
      if (event.target.closest(selector)) {
        callback(event);
      }
    });
  }
}
