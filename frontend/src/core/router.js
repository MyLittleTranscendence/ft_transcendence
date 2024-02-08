import fetchUserInfo from "../api/user/fetchUserInfo.js";
import NotFoundPage from "../pages/NotFoundPage.js";
import showToast from "../utils/showToast.js";

const initRouter = () => {
  let instance;
  let routesMemo;

  const createRouter = () => {
    const $app = document.getElementById("app");

    const handleRouteChange = async () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const mfaRequire = searchParams.get("mfa_require");
      const userId = searchParams.get("user_id");

      let createComponent = routesMemo[path];

      if (path === "/" && mfaRequire && userId) {
        if (mfaRequire === "false") {
          const data = await fetchUserInfo(userId);
          showToast(`Welcome, ${data.username}!`);
        } else if (mfaRequire === "true") {
          sessionStorage.setItem("user_id", userId);
          createComponent = routesMemo["/mfa"];
        }
        window.history.pushState({}, "", path);
      }

      if (createComponent && path !== "/mfa") {
        const component = createComponent($app);
        component.render();
      } else {
        const notFound = new NotFoundPage($app);
        notFound.render();
      }
    };

    const navigate = (path) => {
      window.history.pushState({}, "", path);
      handleRouteChange();
    };

    const handleLinkClick = (e) => {
      if (e.target.matches("[data-link]")) {
        e.preventDefault();
        const clickedURL = e.target.href;
        if (clickedURL !== window.location.href) {
          const path = new URL(clickedURL).pathname;
          navigate(path);
        }
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("click", handleLinkClick);

    handleRouteChange();

    return { navigate };
  };

  return (routes) => {
    if (!instance) {
      routesMemo = { ...routes };
      instance = createRouter();
    }
    return instance;
  };
};

const getRouter = initRouter();

export default getRouter;
