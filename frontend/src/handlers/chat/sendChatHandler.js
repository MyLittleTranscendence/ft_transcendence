import { chatSocket } from "../../socket/socketManager.js";

const sendChatHandler = (e, type, receiverID = null) => {
  if ((e.key === "Enter" || e.keyCode === 13) && !e.isComposing) {
    const { sendSocket } = chatSocket();
    const message = e.target.value.trim();
    if (message !== "") {
      if (type === "total_message") {
        sendSocket("total_message", { message });
      } else if (type === "single_message") {
        sendSocket("single_message", {
          message,
          receiver_id: receiverID,
        });
      }
      e.target.value = "";
    }
  }
};

export default sendChatHandler;
