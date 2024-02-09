import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";

const fetchEnableTwoFA = (code) => {
  fetchAPI
    .post("/2fa/enable", {
      mfa_code: code,
    })
    .then(() => {
      sessionStorage.setItem("mfa_require", true);
      showToast("2FA enabled successfully");
    })
    .catch(() => showToast("Failed to enable 2FA"));
};

export default fetchEnableTwoFA;
