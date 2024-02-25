import { chatSocket } from "../../socket/socketManager.js";
import logoutHandler from "../auth/logoutHandler.js";
import GlobalMessage from "../../components/Lobby/GlobalMessage.js";

const receiveTotalChatMessageHandler = ($target, removeObservers) => {
  const { addSocketObserver } = chatSocket();

  const removeObserver = addSocketObserver("total_message", (message) => {
    const $messageContainer = $target.querySelector(
      "#global-chat-message-container"
    );
    const $messageUL = $messageContainer.querySelector(
      "#global-chat-message-ul"
    );

    const $messageLI = document.createElement("li");
    const globalMessage = new GlobalMessage($messageLI, {
      content: message.message,
      senderId: message.sender_id,
      senderNickname: message.sender_nickname,
      senderProfileImage: message.sender_profile_image,
      datetime: message.datetime,
    });
    globalMessage.render();
    $messageLI.id = `global-${message.datetime}`;
    $messageUL.appendChild($messageLI);
    $messageContainer.scrollTop = $messageContainer.scrollHeight;
  });

  removeObservers.push(removeObserver);
};

export { receiveTotalChatMessageHandler };
