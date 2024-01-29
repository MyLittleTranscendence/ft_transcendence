export default class Component {
  $target; // 컴포넌트를 넣을 부모

  props;

  state;

  constructor($target, props) {
    this.$target = $target;
    this.props = props;
    this.setup();
    this.setEvent();
  }

  setup() {} // 컴포넌트 state 설정

  mounted() {} // 컴포넌트가 마운트 되었을 때

  template() {
    // UI 구성
    return "";
  }

  render() {
    const fragment = document.createDocumentFragment();
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = this.template();

    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
    this.$target.appendChild(fragment);

    this.mounted();
  }

  setEvent() {} // 컴포넌트에서 필요한 이벤트 설정

  setState(newState) {
    // 상태 변경 후 렌더링
    this.$state = { ...this.$state, ...newState };
    this.render();
  }

  addEvent(eventType, selector, callback) {
    // 이벤트 등록 추상화
    this.$target.addEventListener(eventType, (event) => {
      if (!event.target.closest(selector)) return false;
      callback(event);
      return true;
    });
  }
}
