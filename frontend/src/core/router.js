export default class Router {
  static routes = {};

  static init(routes) {
    window.addEventListener("popstate", Router.handleRouteChange);
    window.addEventListener("click", Router.handleLinkClick);
    Router.routes = routes;
    Router.handleRouteChange();
  }

  static handleRouteChange() {
    const path = window.location.pathname;
    const route = Router.routes[path];
    if (route) {
      route.render();
    }
  }

  static handleLinkClick(e) {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      const clickedURL = e.target.href;
      if (clickedURL !== window.location.href) {
        Router.navigate(clickedURL);
      }
    }
  }

  static navigate(path) {
    window.history.pushState({}, "", path);
    Router.routes[path].render();
  }
}
