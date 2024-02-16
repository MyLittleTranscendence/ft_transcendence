import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";
import { myInfoStore } from "../../store/initialStates.js";

const fetchEnableTwoFA = (code, setIsEditingFalse) => {
  fetchAPI
    .post("/2fa/enable", {
      mfa_code: code,
    })
    .then(() => {
      setIsEditingFalse();
      myInfoStore.setState({ mfa_enable: true });
      showToast("2FA enabled successfully");
    })
    .catch(() => showToast("Failed to enable 2FA"));
};

export default fetchEnableTwoFA;
