import NotFoundPage from "../pages/NotFoundPage.js";

export default class Router {
  static routes;

  static handleRouteChange() {
    const path = window.location.pathname;
    const createComponent = Router.routes[path];
    if (createComponent) {
      const component = createComponent(document.getElementById("app"));
      component.render();
    } else {
      const notFound = new NotFoundPage(document.getElementById("app"));
      notFound.render();
    }
  }

  static navigate(path) {
    window.history.pushState({}, "", path);
    Router.handleRouteChange();
  }

  static handleLinkClick = (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      const clickedURL = e.target.href;
      if (clickedURL !== window.location.href) {
        const path = new URL(clickedURL).pathname;
        Router.navigate(path);
      }
    }
  };

  static init(routes) {
    Router.routes = routes;
    window.addEventListener("popstate", Router.handleRouteChange);
    window.addEventListener("click", Router.handleLinkClick);
    Router.handleRouteChange();
  }
}

/*
const {navigate} = router();
*/
