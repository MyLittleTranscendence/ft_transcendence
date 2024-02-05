import fetchAPI from "../utils/fetch/fetchAPI.js";

const fetchSendCode = (startTimer) => {
  fetchAPI
    .post("/2fa/code/")
    .then(() => {
      console.log("code sent to your email");
      startTimer();
      // toast message pop up
    })
    .catch((error) => console.error(error));
};

export default fetchSendCode;
