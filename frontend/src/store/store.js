import createObserver from "./observer.js";

const createStore = (initialState) => {
  let state = initialState;
  const { subscribe, unsubscribe, notify } = createObserver();

  const getState = () => state;

  const setState = (newState) => {
    state = { ...state, ...newState };
    notify();
  };

  return {
    getState,
    setState,
    subscribe,
    unsubscribe,
  };
};

export default createStore;
