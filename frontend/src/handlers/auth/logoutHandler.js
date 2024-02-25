import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";
import showToast from "../../utils/showToast.js";

const logoutHandler = () => {
  const { navigate } = getRouter();

  fetchAPI
    .post("/logout/")
    .then(() => {
      navigate("/start");
      showToast("Bye bye!");
    })
    .catch(() => showToast("Logout failed"));
};

export default logoutHandler;
