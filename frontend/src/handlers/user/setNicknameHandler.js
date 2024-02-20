import fetchNickname from "../../api/user/fetchNickname.js";
import showToast from "../../utils/showToast.js";

const handleSubmitNickname = (event) => {
  event.preventDefault();

  const nickname = event.srcElement.querySelector("#nickname-input").value;

  if (nickname.length <= 3) {
    showToast("Nickname should be at least 4 characters.");
    return;
  }

  fetchNickname({ nickname });
};

export default handleSubmitNickname;
