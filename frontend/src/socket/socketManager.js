const initSocket = (path) => {
  let instance;
  let ws;
  const observers = {};

  const createSocket = () => {
    ws = new WebSocket(`ws://localhost:8000/ws${path}`);

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
      const message = JSON.stringify({ type, ...data });
      ws.send(message);
    };

    return { addSocketObserver, sendSocket };
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
