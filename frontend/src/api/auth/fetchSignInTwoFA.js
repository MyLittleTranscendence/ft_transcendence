import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";
import showToast from "../../utils/showToast.js";
import fetchMyInfo from "../user/fetchMyInfo.js";

const fetchSignInTwoFA = async (code) => {
  try {
    await fetchAPI
      .post("/2fa/token/", {
        mfa_code: code,
      })
      .then(() => sessionStorage.setItem("login", true));
    await fetchMyInfo().then(() => getRouter().navigate("/?login=true"));
  } catch (e) {
    showToast(e);
  }
};

export default fetchSignInTwoFA;
