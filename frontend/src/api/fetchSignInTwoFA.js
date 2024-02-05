import fetchAPI from "../utils/fetch/fetchAPI.js";
import getRouter from "../core/router.js";

const fetchSignInTwoFA = (code) => {
  fetchAPI
    .post("/2fa/token/", {
      mfa_code: code,
    })
    .then((data) => {
      sessionStorage.setItem("access", data.access);
      console.log("access token updated");
      getRouter().navigate("/");
    })
    .catch(() => console.error("2fa verification on sign-in failed"));
};

export default fetchSignInTwoFA;
