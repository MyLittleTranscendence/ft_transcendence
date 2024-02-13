import getChatSocket from "../socket/chatSocket.js";

const sendMessageHandler = (e, type, receiverID = null) => {
  if ((e.key === "Enter" || e.keyCode === 13) && !e.isComposing) {
    const { sendMessage } = getChatSocket();
    const message = e.target.value.trim();
    if (message !== "") {
      if (type === "total_message") {
        sendMessage("total_message", { message });
      } else if (type === "single_message") {
        sendMessage("single_message", {
          message,
          receiver_id: receiverID,
        });
      }
      e.target.value = "";
    }
  }
};

export default sendMessageHandler;
