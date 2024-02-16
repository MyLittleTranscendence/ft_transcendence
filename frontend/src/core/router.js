import NotFoundPage from "../pages/NotFoundPage.js";

const initRouter = () => {
  let instance;
  let routesMemo;

  const createRouter = () => {
    const $app = document.getElementById("app");
    let currentComponent = null;

    const handleRouteChange = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      let createComponent = routesMemo[path];

      if (searchParams.size > 0 && searchParams.get("login") !== "true") {
        const isMFARequire = searchParams.get("mfa_require") === "true";
        const isNewOAuthUser = searchParams.get("is_new_user");

        if (isMFARequire) {
          createComponent = routesMemo["/mfa"];
        } else if (isNewOAuthUser === "true") {
          const userId = searchParams.get("user_id");
          window.history.replaceState(
            null,
            "",
            `/?set-nickname=true&user_id=${userId}`
          );
          createComponent = routesMemo["/set-nickname"];
        } else if (!isNewOAuthUser === "false") {
          window.history.replaceState(
            null,
            "",
            "/?login=true&oauth_finish=true"
          );
        }
      }

      if (currentComponent) {
        currentComponent.unmount();
      }

      if (createComponent && path !== "/mfa" && path !== "/set-nickname") {
        currentComponent = createComponent($app);
        currentComponent.render();
      } else {
        currentComponent = new NotFoundPage($app);
        currentComponent.render();
      }
    };

    const navigate = (url) => {
      const newUrl = new URL(url);
      const currentUrl = window.location;

      if (newUrl.href !== currentUrl.href) {
        window.history.pushState({}, "", newUrl.href);
        handleRouteChange();
      }
    };

    const handleLinkClick = (e) => {
      const link = e.target.closest("[data-link]");
      if (link) {
        e.preventDefault();
        navigate(link.href);
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("click", handleLinkClick);

    return { navigate, handleRouteChange };
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
