import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";

const fetchSendCode = (onCodeSendSuccess) => {
  fetchAPI
    .post("/2fa/code/")
    .then((data) => {
      onCodeSendSuccess(data.email);
    })
    .catch(() => showToast("Failed to send 2FA code"));
};

export default fetchSendCode;
