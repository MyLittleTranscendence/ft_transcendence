import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";
import fetchUserInfo from "../user/fetchUserInfo.js";
import showToast from "../../utils/showToast.js";

const fetchSignInTwoFA = (code) => {
  fetchAPI
    .post("/2fa/token/", {
      mfa_code: code,
    })
    .then(() => {
      fetchUserInfo(sessionStorage.getItem("user_id"));
      getRouter().navigate("/");
      showToast(`Welcome, ${sessionStorage.getItem("username")}!`);
    })
    .catch(() => console.error("2fa verification on sign-in failed"));
};

export default fetchSignInTwoFA;
