import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";

const fetchSignInTwoFA = (code) => {
  fetchAPI
    .post("/2fa/token/", {
      mfa_code: code,
    })
    .then(() => getRouter().navigate("/"))
    .catch(() => console.error("2fa verification on sign-in failed"));
};

export default fetchSignInTwoFA;
