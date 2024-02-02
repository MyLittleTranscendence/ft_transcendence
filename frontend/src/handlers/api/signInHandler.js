import fetchAPI from "../../utils/fetch/fetchAPI.js";
import getRouter from "../../core/router.js";

const signInHandler = async (event) => {
  event.preventDefault();

  const body = {
    username: event.srcElement.querySelector("#signin-form-id").value,
    password: event.srcElement.querySelector("#signin-form-pw").value,
  };

  fetchAPI
    .post("/login/default/", body)
    .then((data) => {
      sessionStorage.setItem('access', data.access);
      sessionStorage.setItem('refresh', data.refresh);
      getRouter().navigate("/");
    })
    .catch((error) => console.log(error));
};

export default signInHandler;
