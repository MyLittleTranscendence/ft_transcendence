import fetchAPI from "../../utils/fetch/fetchAPI.js";

const twoFASelectHandler = () => {
  const userId = sessionStorage.getItem("user_id");

  fetchAPI
    .post(`/2fa/code/`)
    .then(() => {})
    .catch(() => {});
};

export default twoFASelectHandler;
