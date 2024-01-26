import LobbyPage from "../pages/LobbyPage.js";
import LandingPage from "../pages/LandingPage.js";
import MyPage from "../pages/MyPage.js";
import ProfilePage from "../pages/ProfilePage.js";
import PvPGamePage from "../pages/PvPGamePage.js";
import SignUpPage from "../pages/SignUpPage.js";
import TournamentGamePage from "../pages/TournamentGamePage.js";
import JincparkTestPage from "../pages/JincparkTestPage.js";

const routes = {
  "/": (element) => new LobbyPage(element),
  "/landing": (element) => new LandingPage(element),
  "/sign-up": (element) => new SignUpPage(element),
  "/pvp": (element) => new PvPGamePage(element),
  "/tournament": (element) => new TournamentGamePage(element),
  "/my-page": (element) => new MyPage(element),
  "/profile": (element) => new ProfilePage(element),
  "/test-jincpark": (element) => new JincparkTestPage(element),
};

export default routes;
