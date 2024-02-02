import fetchAPI from "../../utils/fetch/fetchAPI.js";
import getRouter from "../../core/router.js";

const signUpHandler = async (event) => {
  event.preventDefault();

  const body = {
    email: event.srcElement.querySelector("#signup-form-email").value,
    nickname: event.srcElement.querySelector("#signup-form-nickname").value,
    username: event.srcElement.querySelector("#signup-form-id").value,
    password: event.srcElement.querySelector("#signup-form-pw").value,
  };

  fetchAPI
    .post("/users/", body)
    .then(() => getRouter().navigate("/sign-in"))
    .catch((error) => console.log(error));
};

export default signUpHandler;
