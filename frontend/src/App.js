import Component from "./core/Component.js";
import router from "./core/router.js";
import { routes } from "./core/routes.js";

export default class App extends Component {
  template() {
    return `
    <div id="app"></div>
		`;
  }

  mounted() {
    router(routes);
  }
}
