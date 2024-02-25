import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";
import { myInfoStore } from "../../store/initialStates.js";

const nicknameUpdateHandler = (userId, $input, setIsEditing, isValid) => {
  const nicknameInput = $input.value.trim();
  if (nicknameInput === $input.defaultValue) {
    setIsEditing(false);
    return;
  }
  if (isValid) {
    fetchAPI
      .patch(`/users/${userId}/`, {
        nickname: nicknameInput,
      })
      .then((data) => {
        setIsEditing(false);
        myInfoStore.setState({ nickname: data.nickname });
        showToast("Nickname changed successfully!");
      })
      .catch(() => {
        showToast("Failed to update nickname");
      });
  }
};

export default nicknameUpdateHandler;
