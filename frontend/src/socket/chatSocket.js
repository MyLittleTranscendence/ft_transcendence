const initChatSocket = () => {
  let instance;
  let ws;
  const listeners = {};

  const createChatSocket = () => {
    ws = new WebSocket("ws://localhost:8000/ws/chat/");

    ws.onmessage = (e) => {
      const message = JSON.parse(e.data);
      if (message.type && listeners[message.type]) {
        listeners[message.type].forEach((listener) => listener(message));
      }
    };

    const addMessageListener = (type, listener) => {
      if (!listeners[type]) {
        listeners[type] = [];
      }
      listeners[type].push(listener);
    };

    const removeMessageListener = (type, listener) => {
      if (listeners[type]) {
        const index = listeners[type].indexOf(listener);
        if (index !== -1) {
          listeners[type].splice(index, 1);
        }
      }
    };

    const sendMessage = (type, data) => {
      const message = JSON.stringify({ type, ...data });
      ws.send(message);
    };

    return { addMessageListener, removeMessageListener, sendMessage };
  };

  return () => {
    if (!instance) {
      instance = createChatSocket();
    }
    return instance;
  };
};

const getChatSocket = initChatSocket();

export default getChatSocket;
