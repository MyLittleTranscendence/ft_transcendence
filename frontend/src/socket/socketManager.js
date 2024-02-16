const initSocket = (path) => {
  let instance;
  let ws;
  const listeners = {};

  const createSocket = () => {
    ws = new WebSocket(`ws://localhost:8000/ws${path}`);

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type && listeners[message.type]) {
        listeners[message.type].forEach((listener) => {
          listener(message);
        });
      }
    };

    const removeListener = (type, listener) => {
      if (listeners[type]) {
        const index = listeners[type].indexOf(listener);
        if (index !== -1) {
          listeners[type].splice(index, 1);
        }
      }
    };

    const addSocketListener = (type, listener) => {
      if (!listeners[type]) {
        listeners[type] = [];
      }
      listeners[type].push(listener);
      return () => removeListener(type, listener);
    };

    const sendSocket = (type, data) => {
      const message = JSON.stringify({ type, ...data });
      ws.send(message);
    };

    return { addSocketListener, sendSocket };
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
