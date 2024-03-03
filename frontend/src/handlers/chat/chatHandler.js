import { chatSocket } from "../../socket/socketManager.js";
import GlobalMessage from "../../components/Lobby/GlobalMessage.js";
import DirectMessage from "../../components/Friend/DirectMessage.js";
import { myInfoStore } from "../../store/initialStates.js";

const appendGlobalMessageToUL = ($ul, message) => {
  const $li = document.createElement("li");
  const globalMessage = new GlobalMessage($li, {
    content: message.message,
    senderId: message.sender_id,
    senderNickname: message.sender_nickname,
    senderProfileImage: message.sender_profile_image,
    datetime: message.datetime,
  });
  globalMessage.render();
  $li.id = `global-${message.datetime}`;
  $ul.appendChild($li);
};

const appendDirectMessageToUL = ($ul, message) => {
  const $li = document.createElement("li");
  const directMessage = new DirectMessage($li, {
    content: message.message,
    senderId: message.sender_id,
    senderNickname: message.sender_nickname,
    senderProfileImage: message.sender_profile_image,
    datetime: message.datetime,
  });
  directMessage.render();
  $li.id = `dm-${message.datetime}`;
  $ul.appendChild($li);
};

const receiveTotalChatMessageHandler = ($target, removeObservers) => {
  const { addSocketObserver } = chatSocket();

  const removeObserver = addSocketObserver("total_message", (message) => {
    const $messageContainer = $target.querySelector(
      "#global-chat-message-container"
    );
    const $messageUL = $messageContainer.querySelector(
      "#global-chat-message-ul"
    );

    appendGlobalMessageToUL($messageUL, message);
    $messageContainer.scrollTop = $messageContainer.scrollHeight;
  });

  removeObservers.push(removeObserver);
};

const receiveSingleChatMessageHandler = (
  $target,
  removeObservers,
  opponentId
) => {
  const { addSocketObserver } = chatSocket();
  const { userId: myId } = myInfoStore.getState();

  const removeObserver = addSocketObserver("single_message", (message) => {
    if (
      (message.sender_id === myId && message.receiver_id === opponentId) ||
      (message.sender_id === opponentId && message.receiver_id === myId)
    ) {
      const $messageContainer = $target.querySelector(
        "#dm-chat-message-container"
      );
      const $messageUL = $messageContainer.querySelector("#dm-chat-message-ul");

      appendDirectMessageToUL($messageUL, message);
      $messageContainer.scrollTop = $messageContainer.scrollHeight;
    }
  });
  removeObservers.push(removeObserver);
};

const storeChatMessageToSessionStorage = () => {
  const { addSocketObserver } = chatSocket();

  let currentMessages;

  const storeAndUpdateMessages = (type, message) => {
    try {
      currentMessages = JSON.parse(sessionStorage.getItem(type)) || [];

      const newMessage = {
        message: message.message,
        sender_id: message.sender_id,
        sender_nickname: message.sender_nickname,
        sender_profile_image: message.sender_profile_image,
        datetime: message.datetime,
        receiver_id: message.receiver_id || "all",
      };

      currentMessages.push(newMessage);

      sessionStorage.setItem(type, JSON.stringify(currentMessages));
    } catch (e) {
      // QuotaExceededError: sessionStorage 용량 제한 초과 시 발생
      if (e.name === "QuotaExceededError") {
        while (currentMessages.length > 0) {
          currentMessages.shift();
          try {
            sessionStorage.setItem(type, JSON.stringify(currentMessages));
            break;
          } catch (error) {
            if (error.name !== "QuotaExceededError") {
              throw error;
            }
          }
        }
      } else {
        throw e;
      }
    }
  };

  addSocketObserver("total_message", (message) =>
    storeAndUpdateMessages("global_message", message)
  );
  addSocketObserver("single_message", (message) =>
    storeAndUpdateMessages("direct_message", message)
  );
};

export {
  receiveTotalChatMessageHandler,
  receiveSingleChatMessageHandler,
  storeChatMessageToSessionStorage,
  appendGlobalMessageToUL,
  appendDirectMessageToUL,
};
