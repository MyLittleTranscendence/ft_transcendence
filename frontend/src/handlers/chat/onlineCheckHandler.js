import { chatSocket } from "../../socket/socket.js";
import { friendOnlineStatusStore } from "../../store/initialStates.js";

const onlineCheckHandler = (removeObservers) => {
  const { addSocketObserver } = chatSocket();

  const removeObserver = addSocketObserver("login_message", (message) => {
    const { onlineStatus: prevStatus } = friendOnlineStatusStore.getState();

    const newStatus = { ...prevStatus, ...message.friends_status };

    friendOnlineStatusStore.setState({
      onlineStatus: newStatus,
    });
  });

  removeObservers.push(removeObserver);
};

export default onlineCheckHandler;
