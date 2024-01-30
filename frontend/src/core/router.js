import NotFoundPage from "../pages/NotFoundPage.js";

const initRouter = () => {
  let instance;
  let routesMemo;

  const createRouter = () => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      const createComponent = routesMemo[path];
      if (createComponent) {
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
