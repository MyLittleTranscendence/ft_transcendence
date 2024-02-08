import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";
import fetchUserInfo from "../user/fetchUserInfo.js";
import showToast from "../../utils/showToast.js";

const fetchSignIn = (body, $query) => {
  const { navigate } = getRouter();

  fetchAPI
    .post("/login/default/", body)
    .then((data) => {
      if (data.mfa_require) {
        navigate(`/?mfa_require=true&user_id=${data.user_id}`);
      } else {
        fetchUserInfo(data.user_id);
        navigate("/");
        showToast(`Welcome, ${data.username}!`);
      }
    })
    .catch(() => {
      $query.textContent = "ID or PW is Incorrect";
    });
};

export default fetchSignIn;
