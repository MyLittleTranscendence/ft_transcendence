import fetchAPI from "/src/utils/fetch/fetchAPI.js";
import getRouter from "/src/core/router.js";

const signUpHandler = async (event) => {
  event.preventDefault();

  const body = {
    email: event.srcElement[4].value,
    nickname: event.srcElement[1].value,
    username: event.srcElement[0].value,
    password: event.srcElement[2].value,
  };

  fetchAPI
    .post("/users/", body)
    .then(() => getRouter().navigate("/sign-in"))
    .catch((e) => console.log(e));
};

export default signUpHandler;
