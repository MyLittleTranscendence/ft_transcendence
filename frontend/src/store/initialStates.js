import createStore from "./store.js";

const myInfoStore = createStore({
  id: null,
  nickname: "",
  wins: 0,
  losses: 0,
  profile_image: "",
  username: "",
  email: "",
  mfa_enable: "",
});

const gameStateStore = createStore({ gameState: "" });

const testStore = createStore({ number: 0 });

export { myInfoStore, gameStateStore, testStore };
