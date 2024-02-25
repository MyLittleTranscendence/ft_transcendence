import logoutHandler from "./logoutHandler.js";

const receiveLogoutHandler = (removeObservers, getSocket) => {
  const { addSocketObserver } = getSocket();

  const removeObserver = addSocketObserver("user_logout", () => {
    logoutHandler();
  });
  removeObservers.push(removeObserver);
};

export default receiveLogoutHandler;
