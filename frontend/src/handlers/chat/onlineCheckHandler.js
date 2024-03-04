import { chatSocket } from "../../socket/socket.js";
import OnlineIcon from "../../components/UI/Icon/OnlineIcon.js";

const onlineCheckHandler = ($holder, userId, removeObservers) => {
  const { addSocketObserver } = chatSocket();

  const removeObserver = addSocketObserver("login_message", (message) => {
    if (message.friends_status[userId]) {
      const onlineIcon = new OnlineIcon($holder);
      onlineIcon.render();
    }
  });
  removeObservers.push(removeObserver);
};

export default onlineCheckHandler;
