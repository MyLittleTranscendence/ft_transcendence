import NotFoundPage from "../pages/NotFoundPage.js";

const router = (() => {
  let routerInstance;

  if (routerInstance) {
    return routerInstance;
  }

  return (routes) => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      const createComponent = routes[path];
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
          navigate(clickedURL);
        }
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    window.addEventListener("click", handleLinkClick);

    handleRouteChange();

    routerInstance = { navigate };

    return routerInstance;
  };
})();

export default router;

/*
const {navigate} = router();
*/
