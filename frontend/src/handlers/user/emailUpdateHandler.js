import { myInfoStore } from "../../store/initialStates.js";
import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";

const emailUpdateHandler = (inputEmail, defaultValue, setIsEditingFalse) => {
  if (inputEmail === "") {
    showToast("Please input E-Mail.");
    return;
  }
  if (inputEmail === defaultValue) {
    setIsEditingFalse();
    return;
  }
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (!emailPattern.test(inputEmail)) {
    showToast("Invalid E-Mail format.");
    return;
  }

  fetchAPI
    .patch(`/users/${myInfoStore.getState().id}/`, { email: inputEmail })
    .then((data) => {
      myInfoStore.setState({ email: data.email });
      setIsEditingFalse();
      showToast("E-Mail updated successfully!");
    })
    .catch((e) => {
      setIsEditingFalse();
      showToast(e.detail);
    });
};

export default emailUpdateHandler;
