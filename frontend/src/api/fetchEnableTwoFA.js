import fetchAPI from "../utils/fetch/fetchAPI.js";

const fetchEnableTwoFA = (code) => {
  fetchAPI
    .post("/2fa/enable/", {
      mfa_code: code,
    })
    .then(() => {
      sessionStorage.setItem("mfa_require", true);
      console.log("2fa successfully enabled");
    })
    .catch(() => console.error("2fa enable failed"));
};

export default fetchEnableTwoFA;
