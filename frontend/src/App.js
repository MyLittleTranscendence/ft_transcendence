import Component from "./core/Component.js";
import router from "./core/router.js";
import routes from "./core/routes.js";

export default class App extends Component {
  template() {
    return `
    <div id="app" class="d-flex justify-content-center"></div>
		`;
  }

  mounted() {
    router(routes);
  }
}
