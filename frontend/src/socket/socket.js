import escapeHtml from "../utils/escapeHTML.js";

const initSocket = (path) => {
  let instance;
  let ws;
  let observers = {};

  const createSocket = () => {
    ws = new WebSocket(`wss://localhost/ws${path}`);

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type && observers[message.type]) {
        observers[message.type].forEach((observer) => {
          observer(message);
        });
      }
    };

    const removeobserver = (type, observer) => {
      if (observers[type]) {
        const index = observers[type].indexOf(observer);
        if (index !== -1) {
          observers[type].splice(index, 1);
        }
      }
    };

    const addSocketObserver = (type, observer) => {
      if (!observers[type]) {
        observers[type] = [];
      }
      observers[type].push(observer);
      return () => removeobserver(type, observer);
    };

    const sendSocket = (type, data) => {
      const escapedData = Object.keys(data).reduce((acc, key) => {
        const value = data[key];
        acc[key] = typeof value === "string" ? escapeHtml(value) : value;
        return acc;
      }, {});

      const message = JSON.stringify({ type, ...escapedData });
      ws.send(message);
    };

    const clearSocket = () => {
      instance = null;
      ws.close();
      ws = null;
      observers = {};
    };

    return { addSocketObserver, sendSocket, clearSocket };
  };

  return () => {
    if (!instance) {
      instance = createSocket();
    }
    return instance;
  };
};

const chatSocket = initSocket("/chat/");
const gameSocket = initSocket("/game/");

export { chatSocket, gameSocket };
