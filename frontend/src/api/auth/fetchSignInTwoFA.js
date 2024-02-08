import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";
import showToast from "../../utils/showToast.js";
import fetchUserInfo from "../user/fetchUserInfo.js";

const fetchSignInTwoFA = async (code) => {
  try {
    await fetchAPI.post("/2fa/token/", {
      mfa_code: code,
    });
    const data = await fetchUserInfo(sessionStorage.getItem("user_id"));

    getRouter().navigate("/");
    showToast(`Welcome, ${data.username}!`);
  } catch (e) {
    showToast(e);
  }
};

export default fetchSignInTwoFA;
