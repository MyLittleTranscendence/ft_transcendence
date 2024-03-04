import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";
import showToast from "../../utils/showToast.js";

const fetchSignInTwoFA = (code) => {
  const { navigate } = getRouter();
  fetchAPI
    .post("/2fa/token/", {
      mfa_code: code,
    })
    .then(() => navigate("/?login=true"))
    .catch((e) => {
      if (e.status === 400) {
        showToast("Invalid code. Please try again.");
      } else {
        showToast(e);
        navigate("/start");
      }
    });
};

export default fetchSignInTwoFA;
