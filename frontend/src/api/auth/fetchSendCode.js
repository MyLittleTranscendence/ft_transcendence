import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";
import getRouter from "../../core/router.js";

const fetchSendCode = (onCodeSendSuccess) => {
  fetchAPI
    .post("/2fa/code")
    .then((data) => {
      onCodeSendSuccess(data.email);
    })
    .catch((e) => {
      showToast(e);
      getRouter().navigate("/start");
    });
};

export default fetchSendCode;
