import showToast from "../../utils/showToast.js";
import { gameSocket } from "../../socket/socket.js";

const inviteUserHandler = (userId) => {
  const { sendSocket } = gameSocket();

  sendSocket("invite_user", { invited_user_id: userId });
  showToast("Invitation has been sent");
};

const invitationFailHandler = (removeObservers) => {
  const { addSocketObserver } = gameSocket();

  const removeObserver = addSocketObserver("invite_impossible", () =>
    showToast("Cannot invite this user now")
  );
};
export { inviteUserHandler, invitationFailHandler };
