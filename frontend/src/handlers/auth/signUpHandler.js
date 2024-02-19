import fetchSignUp from "../../api/auth/fetchSignUp.js";

const signUpHandler = async (event) => {
  event.preventDefault();

  const body = {
    email: event.srcElement.querySelector("#signup-form-email").value,
    nickname: event.srcElement.querySelector("#signup-form-nickname").value,
    username: event.srcElement.querySelector("#signup-form-id").value,
    password: event.srcElement.querySelector("#signup-form-pw").value,
  };

  fetchSignUp(body);
};

export default signUpHandler;
