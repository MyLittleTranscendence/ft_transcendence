import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";
import showToast from "../../utils/showToast.js";

const fetchSignIn = (body, $query) => {
  const { navigate } = getRouter();
  const $warning = $query;

  fetchAPI
    .post("/login/default/", body)
    .then((data) => {
      if (data.mfa_require === true) {
        navigate("/?mfa_require=true");
      } else {
        navigate("/?login=true");
      }
    })
    .catch((e) => {
      if (e.status === 401) {
        $warning.textContent = "ID or PW is Incorrect";
      } else {
        showToast(e);
      }
    });
};

export default fetchSignIn;
