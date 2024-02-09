import fetchMyInfo from "./api/user/fetchMyInfo.js";
import Component from "./core/Component.js";
import getRouter from "./core/router.js";
import routes from "./core/routes.js";
import showToast from "./utils/showToast.js";

export default class App extends Component {
  template() {
    return `
    <div id="app" class="d-flex justify-content-center"></div>
		`;
  }

  mounted() {
    const { navigate, handleRouteChange } = getRouter(routes);
    this.handleAuthentication(navigate, handleRouteChange);
    handleRouteChange();
    // const currentPath = window.location.pathname;
    // const searchParams = new URLSearchParams(window.location.search);

    // if (sessionStorage.getItem("login") === "true") {
    //   fetchMyInfo().catch(() => {
    //     sessionStorage.clear();
    //     navigate("/start");
    //   });
    // }

    // if (searchParams.get("oauth") === "true") {
    //   sessionStorage.setItem("login", "true");
    //   fetchMyInfo().then((data) => showToast(`Welcome, ${data.nickname}`));
    //   window.history.pushState({}, "", "/");
    // }

    // if (sessionStorage.getItem("login") === "true") {
    //   if (
    //     currentPath === "/start" ||
    //     currentPath === "/sign-in" ||
    //     currentPath === "/sign-up"
    //   ) {
    //     navigate("/");
    //   } else {
    //     handleRouteChange();
    //   }
    // } else {
    //   navigate("/start");
    // }
  }

  handleAuthentication(navigate, handleRouteChange) {
    const isAuthenticated = sessionStorage.getItem("login") === "true";
    const searchParams = new URLSearchParams(window.location.search);
    const currentPath = window.location.pathname;

    if (isAuthenticated) {
      this.validateSession(navigate);
    } else if (searchParams.get("oauth") === "true") {
      this.loginUserWithOAuth(navigate);
    } else {
      this.navigateToStart(currentPath, navigate);
    }
  }

  validateSession(navigate) {
    fetchMyInfo()
      .then((data) => showToast(`Welcome, ${data.nickname}`))
      .catch(() => this.clearSessionStorageAndNavigateToStart(navigate));
  }

  loginUserWithOAuth(navigate) {
    sessionStorage.setItem("login", "true");
    fetchMyInfo()
      .then((data) => {
        showToast(`Welcome, ${data.nickname}`);
        navigate("/");
      })
      .catch(() => this.clearSessionStorageAndNavigateToStart(navigate));
  }

  navigateToStart(currentPath, navigate) {
    const shouldNavigateToStart = ["/start", "/sign-in", "/sign-up"].includes(
      currentPath
    );
    if (shouldNavigateToStart) {
      navigate("/start");
    }
  }

  clearSessionStorageAndNavigateToStart(navigate) {
    sessionStorage.clear();
    navigate("/start");
  }
}
