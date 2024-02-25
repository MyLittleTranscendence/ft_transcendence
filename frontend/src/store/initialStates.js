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
  winner: 0,
});

const tournamentBeginUserIdStore = createStore({
  game1LeftUserId: 0,
  game1RightUserId: 0,
  game2LeftUserId: 0,
  game2RightUserId: 0,
});

const gameStatusStore = createStore({ isInGame: false });

const friendListStore = createStore({ friends: [], isFetched: false });

const blockListStore = createStore({ blocks: [], isFetched: false });

export {
  myInfoStore,
  gameInfoStore,
  gameStatusStore,
  friendListStore,
  blockListStore,
  tournamentBeginUserIdStore,
};
