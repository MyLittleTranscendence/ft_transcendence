import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";
import showToast from "../../utils/showToast.js";
import { gameSocket, chatSocket } from "../../socket/socket.js";

const logoutHandler = () => {
  const { navigate } = getRouter();

  fetchAPI
    .post("/logout/")
    .then(() => {
      navigate("/start");
      sessionStorage.removeItem("global_message");
      sessionStorage.removeItem("direct_message");
      showToast("Bye bye!");
      const { clearSocket: clearGameSocket } = gameSocket();
      const { clearSocket: clearChatSocket } = chatSocket();
      clearGameSocket();
      clearChatSocket();
    })
    .catch(() => showToast("Logout failed"));
};

export default logoutHandler;
