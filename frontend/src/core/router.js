import NotFoundPage from "../pages/NotFoundPage.js";

const initRouter = () => {
  let instance;
  let routesMemo;

  const createRouter = () => {
    const $app = document.getElementById("app");

    const handleRouteChange = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);

      const isMFARequire =
        path === "/" && searchParams.get("mfa_require") === "true";
      const OAuthFinishQueryParam = searchParams.get("is_new_user");
      const isOAuthFinished = OAuthFinishQueryParam === true;
      const isNewOAuthUser = OAuthFinishQueryParam === "true";

      if (isOAuthFinished && !isNewOAuthUser) {
        window.history.replaceState(null, "", "/?login=true");
      }

      let createComponent = routesMemo[path];

      if (isNewOAuthUser) {
        const userId = searchParams.get("user_id");
        window.history.replaceState(null, "", `/?${userId}`);
        createComponent = routesMemo["/set-nickname"];
      } else if (isMFARequire) {
        createComponent = routesMemo["/mfa"];
      }

      if (createComponent && path !== "/mfa" && path !== "/set-nickname") {
        const component = createComponent($app);
        component.render();
      } else {
        const notFound = new NotFoundPage($app);
        notFound.render();
      }
    };

    const navigate = (path) => {
      if (window.history.pathname !== path) {
        window.history.pushState({}, "", path);
        handleRouteChange();
      }
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
