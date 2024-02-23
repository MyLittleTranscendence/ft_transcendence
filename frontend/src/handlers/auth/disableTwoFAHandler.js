import fetchAPI from "../../utils/fetchAPI.js";
import { myInfoStore } from "../../store/initialStates.js";
import showToast from "../../utils/showToast.js";

const disableTwoFAHandler = () => {
  fetchAPI
    .post("/2fa/disable/")
    .then(() => {
      myInfoStore.setState({ mfaEnable: false });
      showToast("2FA disabled successfully");
    })
    .catch((e) => {
      if (e.status === 401) {
        showToast("Wrong verification code.");
      } else {
        showToast("Error: Failed to disable 2FA");
      }
    });
};

export default disableTwoFAHandler;
