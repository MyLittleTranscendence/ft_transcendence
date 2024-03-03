import fetchFriendList from "./api/user/fetchFriendList.js";
import fetchBlockList from "./api/user/fetchBlockList.js";
import fetchMyInfo from "./api/user/fetchMyInfo.js";
import Component from "./core/Component.js";
import getRouter from "./core/router.js";
import routes from "./core/routes.js";
import { storeChatMessageToSessionStorage } from "./handlers/chat/chatHandler.js";

export default class App extends Component {
  template() {
    return `
    <div id="app" class="d-flex justify-content-center"></div>
		`;
  }

  mounted() {
    this.validateSessionOnApplicationLoad();
  }

  validateSessionOnApplicationLoad() {
    const { navigate, handleRouteChange } = getRouter(routes);
    const currentPath = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    const validateSession = () => {
      fetchMyInfo()
        .then(() => {
          localStorage.setItem("login", "true");
          fetchFriendList();
          fetchBlockList();
          storeChatMessageToSessionStorage();
          if (
            ["/start", "/sign-in", "/sign-up", "/mfa"].includes(currentPath)
          ) {
            navigate("/");
          } else {
            handleRouteChange();
          }
        })
        .catch((e) => {
          if (e.status && e.status === 401) {
            localStorage.clear();
            navigate("/start");
          } else {
            console.error(e);
          }
        });
    };

    if (
      localStorage.getItem("login") === "true" ||
      searchParams.get("oauth_finish") === "true"
    ) {
      validateSession();
    } else if (
      searchParams.get("mfa_require") === "true" ||
      searchParams.get("oauth") === "true"
    ) {
      handleRouteChange();
    } else {
      navigate("/start");
    }
  }
}
