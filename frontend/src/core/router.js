import NotFoundPage from "../pages/NotFoundPage.js";

const initRouter = () => {
  let instance;
  let routesMemo;

  const createRouter = () => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);

      let createComponent = routesMemo[path];

      if (path === "/" && searchParams.get("oauth") === "true") {
        const mfaRequire = searchParams.get("mfa_require");
        sessionStorage.setItem("mfa_require", mfaRequire);
        sessionStorage.setItem("user_id", searchParams.get("user_id"));
        if (mfaRequire === "true") {
          createComponent = routesMemo["/mfa"];
        }
      }

      if (createComponent && path !== "/mfa") {
        const component = createComponent(document.getElementById("app"));
        component.render();
      } else {
        const notFound = new NotFoundPage(document.getElementById("app"));
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

/*
const {navigate} = router();
*/
