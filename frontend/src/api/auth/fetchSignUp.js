import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";

const fetchSignUp = (body) => {
  fetchAPI
    .post("/users/", body)
    .then(() => getRouter().navigate("/sign-in"))
    .catch((error) => console.log(error));
};

export default fetchSignUp;
