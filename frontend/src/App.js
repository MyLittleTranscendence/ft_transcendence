import router from "./core/router.js";
import Component from "./core/Component.js";
import Home from "./test/HomePage.js";
import Counter from "./test/Counter.js";

export default class App extends Component {
  template() {
    return `
		<header>
		<a href="/" data-link>Home</a>
		<a href="/counter" data-link>Counter</a>
		<a href="/fetch" data-link>Fetch</a>
		</header>
		<main></main>
		`;
  }

  mounted() {
    const $main = this.$target.querySelector("main");

    const routes = {
      "/": new Home($main),
      "/counter": new Counter($main),
    };

    router(routes);
  }
}
