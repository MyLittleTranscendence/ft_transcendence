import createObserver from "./storeObserver.js";

const createStore = (initialState) => {
  let state = initialState;
  const { subscribe, notify } = createObserver();

  const getState = () => state;

  const setState = (newState) => {
    state = { ...state, ...newState };
    notify();
  };

  return {
    getState,
    setState,
    subscribe,
  };
};

export default createStore;
