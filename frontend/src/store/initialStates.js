import createStore from "./store.js";

const myInfoStore = createStore({
  userId: null,
  nickname: "",
  wins: 0,
  losses: 0,
  profileImage: "asset/default.png",
  username: "",
  email: "",
  mfaEnable: "",
});

const gameInfoStore = createStore({
  barHeight: 100,
  barWidth: 18,
  ballRadius: 9,
  gameType: "",
  leftScore: "0",
  leftUserId: 0,
  rightScore: "0",
  rightUserId: 0,
  screenHeight: 600,
  screenWidth: 800,
  status: "before",
  winner: "NONE",
});

const gameStatusStore = createStore({ isInGame: false });

export { myInfoStore, gameInfoStore, gameStatusStore };
