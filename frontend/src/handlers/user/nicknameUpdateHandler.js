import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";
import { myInfoStore } from "../../store/initialStates.js";

const nicknameUpdateHandler = (userId, $input, setIsEditing) => {
  const nicknameInput = $input.value.trim();
  if (nicknameInput.length < 4) {
    showToast("Minimum length of nickname is 4");
    return;
  }
  if (nicknameInput === $input.defaultValue) {
    setIsEditing(false);
    return;
  }
  if (nicknameInput.length >= 4) {
    fetchAPI
      .patch(`/users/${userId}/`, {
        nickname: nicknameInput,
      })
      .then((data) => {
        setIsEditing(false);
        myInfoStore.setState({ nickname: data.nickname });
        showToast("Nickname changed successfully!");
      })
      .catch((e) => {
        if (e.status === 409) {
          showToast("Nickname already exists");
        } else {
          showToast("Failed to update nickname");
        }
      });
  }
};

export default nicknameUpdateHandler;
