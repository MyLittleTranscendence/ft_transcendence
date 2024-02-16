import LobbyPage from "../pages/LobbyPage.js";
import StartPage from "../pages/StartPage.js";
import ProfilePage from "../pages/ProfilePage.js";
import PvPGamePage from "../pages/PvPGamePage.js";
import SignUpPage from "../pages/SignUpPage.js";
import SignInPage from "../pages/SignInPage.js";
import TwoFAPage from "../pages/TwoFAPage.js";
import TournamentGamePage from "../pages/TournamentGamePage.js";
import HyeonjunTestPage from "../pages/HyeonjunTestPage.js";

const routes = {
  "/": ($element) => new LobbyPage($element),
  "/start": ($element) => new StartPage($element),
  "/sign-in": ($element) => new SignInPage($element),
  "/sign-up": ($element) => new SignUpPage($element),
  "/pvp": ($element) => new PvPGamePage($element),
  "/mfa": ($element) => new TwoFAPage($element),
  "/tournament": ($element) => new TournamentGamePage($element),
  "/profile": ($element) => new ProfilePage($element),
  "/test-hyeonjun": ($element) => new HyeonjunTestPage($element),
};

export default routes;
