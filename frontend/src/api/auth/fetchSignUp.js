import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";
import showToast from "../../utils/showToast.js";

const fetchSignUp = (body) => {
  fetchAPI
    .post("/users/", body)
    .then(() => {
      getRouter().navigate("/sign-in");
      showToast("You have signed up successfully!");
    })
    .catch((e) => showToast(e));
};

export default fetchSignUp;
