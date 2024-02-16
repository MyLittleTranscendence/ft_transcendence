export default class Component {
  $target;

  props;

  state;

  eventListeners = [];

  removeSocketListeners = [];

  children = [];

  constructor($target, props, parent) {
    this.$target = $target;
    this.props = props;
    if (parent) {
      parent.addChild(this);
    }
    this.setup();
    this.setEvent();
  }

  setup() {}

  mounted() {}

  template() {
    return "";
  }

  render() {
    this.$target.innerHTML = this.template();
    this.mounted();
  }

  setEvent() {}

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  addEvent(eventType, selector, callback) {
    const callbackMemo = (event) => {
      if (event.target.closest(selector)) {
        callback(event);
      }
    };
    this.$target.addEventListener(eventType, callbackMemo);
    this.eventListeners.push({ eventType, callbackMemo });
  }

  addChild(childComponent) {
    this.children.push(childComponent);
  }

  unmount() {
    this.eventListeners.forEach(({ eventType, callback }) =>
      this.$target.removeEventListener(eventType, callback)
    );
    this.eventListeners = [];

    this.removeSocketListeners.forEach((removeListener) => removeListener());
    this.removeSocketListeners = [];

    this.children.forEach((child) => child.unmount());
    this.children = [];
  }
}
