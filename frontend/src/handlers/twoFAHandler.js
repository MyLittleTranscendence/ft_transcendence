import fetchEnableTwoFA from "../api/fetchEnableTwoFA.js";
import fetchSignInTwoFA from "../api/fetchSignInTwoFA.js";

const twoFAHandler = (event) => {
  event.preventDefault();

  const formType = event.target.getAttribute("data-form-type");
  const codeInput = event.srcElement.querySelector("#two-fa-code-input").value;

  if (formType === "enable") {
    fetchEnableTwoFA(codeInput);
  } else if (formType === "signin") {
    fetchSignInTwoFA(codeInput);
  }
};

export default twoFAHandler;
