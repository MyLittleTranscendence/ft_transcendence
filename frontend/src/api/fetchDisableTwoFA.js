import fetchAPI from "../utils/fetch/fetchAPI.js";

const fetchDisableTwoFA = () => {
  fetchAPI
    .post("/2fa/disable/")
    .then(() => {
      sessionStorage.setItem("mfa_require", false);
      console.log("2fa successfully disabled");
    })
    .catch(() => console.error("2fa disable failed"));
};

export default fetchDisableTwoFA;
