import fetchAPI from "../../utils/fetchAPI.js";

const fetchSendCode = (onCodeSendSuccess) => {
  fetchAPI
    .post("/2fa/code/")
    .then((data) => {
      console.log("code sent to your email");
      onCodeSendSuccess(data.email);
      // toast message pop up
    })
    .catch((error) => console.error(error));
};

export default fetchSendCode;
