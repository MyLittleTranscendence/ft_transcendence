import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";
import { myInfoStore } from "../../store/initialStates.js";

const fetchDisableTwoFA = () => {
  fetchAPI
    .post("/2fa/disable")
    .then(() => {
      myInfoStore.setState({ mfa_require: false });
      showToast("2FA disabled successfully");
    })
    .catch(() => showToast("Failed to disable 2FA"));
};

export default fetchDisableTwoFA;
