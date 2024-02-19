import fetchEnableTwoFA from "../../api/auth/fetchEnableTwoFA.js";
import fetchSignInTwoFA from "../../api/auth/fetchSignInTwoFA.js";

const twoFAHandler = (event, setIsEditingFalse) => {
  event.preventDefault();

  const formType = event.target.getAttribute("data-form-type");
  const codeInput = event.srcElement.querySelector("#two-fa-code-input").value;

  if (formType === "enable") {
    fetchEnableTwoFA(codeInput, setIsEditingFalse);
  } else if (formType === "signin") {
    fetchSignInTwoFA(codeInput);
  }
};

export default twoFAHandler;
