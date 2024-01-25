import router from "./core/router.js";
import Component from "./core/Component.js";
import LandingPage from "./pages/LandingPage.js";
import SignUpPage from "./pages/SignUpPage.js";
import LobbyPage from "./pages/LobbyPage.js";
import PvPGamePage from "./pages/PvPGamePage.js";
import TournamentGamePage from "./pages/TournamentGamePage.js";
import MyPage from "./pages/MyPage.js";
import ProfilePage from "./pages/ProfilePage.js";

export default class App extends Component {
  template() {
    return `
    <div id="app"></div>
		`;
  }

  mounted() {
    const appDiv = this.$target.querySelector("#app");

    const routes = {
      "/": new LobbyPage(appDiv),
      "/landing": new LandingPage(appDiv),
      "/sign-up": new SignUpPage(appDiv),
      "/pvp": new PvPGamePage(appDiv),
      "/tournament": new TournamentGamePage(appDiv),
      "/my-page": new MyPage(appDiv),
      "/profile": new ProfilePage(appDiv),
    };

    router(routes);
  }
}
