let routerInstance;

const router = (routes) => {
  if (routerInstance) {
    return routerInstance;
  }

  const handleRouteChange = () => {
    const path = window.location.pathname;
    const createComponent = routes[path];
    if (createComponent) {
      const component = createComponent(document.getElementById("app"));
      component.render();
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
}; // IIFE를 사용하면 더 효율적

export default router;

/*
const {navigate} = router();
*/
