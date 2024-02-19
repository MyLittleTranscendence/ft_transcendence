import LobbyPage from "../pages/LobbyPage.js";
import StartPage from "../pages/StartPage.js";
import ProfilePage from "../pages/ProfilePage.js";
import SignUpPage from "../pages/SignUpPage.js";
import SignInPage from "../pages/SignInPage.js";
import TwoFAPage from "../pages/TwoFAPage.js";
import SetNicknamePage from "../pages/SetNicknamePage.js";
import HyeonjunTestPage from "../pages/HyeonjunTestPage.js";
import PvPReadyPage from "../pages/PvPReadyPage.js";
import TournamentReadyPage from "../pages/TournamentReadyPage.js";
import PongGamePage from "../pages/PongGamePage.js";

const routes = {
  "/": ($element) => new LobbyPage($element),
  "/start": ($element) => new StartPage($element),
  "/sign-in": ($element) => new SignInPage($element),
  "/sign-up": ($element) => new SignUpPage($element),
  "/mfa": ($element) => new TwoFAPage($element),
  "/set-nickname": ($element) => new SetNicknamePage($element),
  "/pvp-ready": ($element) => new PvPReadyPage($element),
  "/tournament-ready": ($element) => new TournamentReadyPage($element),
  "/game": ($element) => new PongGamePage($element),
  "/profile": ($element) => new ProfilePage($element),
  "/test-hyeonjun": ($element) => new HyeonjunTestPage($element),
};

export default routes;
