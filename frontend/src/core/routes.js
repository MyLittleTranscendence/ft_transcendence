import LobbyPage from "../pages/LobbyPage.js";
import StartPage from "../pages/StartPage.js";
import ProfilePage from "../pages/ProfilePage.js";
import PvPGamePage from "../pages/PvPGamePage.js";
import SignUpPage from "../pages/SignUpPage.js";
import SignInPage from "../pages/SignInPage.js";
import TwoFAPage from "../pages/TwoFAPage.js";
import TournamentGamePage from "../pages/TournamentGamePage.js";
import SetNicknamePage from "../pages/SetNicknamePage.js";
import HyeonjunTestPage from "../pages/HyeonjunTestPage.js";
import FriendsPage from "../pages/FriendsPage.js";

const routes = {
  "/": ($element) => new LobbyPage($element),
  "/start": ($element) => new StartPage($element),
  "/sign-in": ($element) => new SignInPage($element),
  "/sign-up": ($element) => new SignUpPage($element),
  "/mfa": ($element) => new TwoFAPage($element),
  "/set-nickname": ($element) => new SetNicknamePage($element),
  "/pvp": ($element) => new PvPGamePage($element),
  "/tournament": ($element) => new TournamentGamePage($element),
  "/profile": ($element) => new ProfilePage($element),
  "/friend": ($element) => new FriendsPage($element),
  "/test-hyeonjun": ($element) => new HyeonjunTestPage($element),
};

export default routes;
