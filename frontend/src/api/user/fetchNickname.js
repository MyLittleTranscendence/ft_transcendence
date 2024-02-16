import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";
import showToast from "../../utils/showToast.js";
import { myInfoStore } from "../../store/initialStates.js";

const fetchNickname = (body) => {
  const searchParams = new URLSearchParams(window.location.search);
  const userId = searchParams.get("user_id") || myInfoStore.getState().id;

  if (!userId) {
    showToast("No user ID found.");
    return;
  }

  fetchAPI
    .patch(`/users/${userId}`, body)
    .then(() => {
      if (window.location.pathname === "/profile") {
        showToast("Your nickname has set successfully!");
      } else {
        getRouter().navigate("/?login=true"); // initial OAuth user
      }
    })
    .catch((e) => showToast(e));
};

export default fetchNickname;
