const router = (routes) => {
  const handleRouteChange = () => {
    const path = window.location.pathname;
    const route = routes[path];
    if (route) {
      route.render();
    }
  };

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    handleRouteChange();
  };

  window.addEventListener("popstate", () => handleRouteChange());
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      const clickedURL = e.target.href;
      if (clickedURL !== window.location.href) {
        navigate(clickedURL);
      }
    }
  });

  handleRouteChange();
};

export default router;
