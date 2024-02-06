import fetchSignIn from "../api/auth/fetchSignIn.js";

const signInHandler = async (event) => {
  event.preventDefault();

  const body = {
    username: event.srcElement.querySelector("#signin-form-id").value,
    password: event.srcElement.querySelector("#signin-form-pw").value,
  };

  fetchSignIn(body);
};

export default signInHandler;
