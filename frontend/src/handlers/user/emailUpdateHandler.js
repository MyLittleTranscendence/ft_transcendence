import { myInfoStore } from "../../store/initialStates.js";
import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";

const emailUpdateHandler = (
  inputEmail,
  defaultValue,
  setIsEditingFalse,
  isValid
) => {
  if (inputEmail === defaultValue) {
    setIsEditingFalse();
    return;
  }

  if (isValid) {
    fetchAPI
      .patch(`/users/${myInfoStore.getState().userId}/`, { email: inputEmail })
      .then((data) => {
        myInfoStore.setState({ email: data.email, mfaEnable: data.mfa_enable });
        setIsEditingFalse();
        showToast("E-Mail updated successfully!");
      })
      .catch((e) => {
        setIsEditingFalse();
        showToast(e.detail);
      });
  }
};

export default emailUpdateHandler;
