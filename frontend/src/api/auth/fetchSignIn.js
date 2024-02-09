import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";
import fetchMyInfo from "../user/fetchMyInfo.js";

const fetchSignIn = async (body, $query) => {
  const { navigate } = getRouter();
  const $warning = $query;

  try {
    const loginData = await fetchAPI.post("/login/default/", body);

    if (loginData.mfa_require === true) {
      navigate("/?mfa_require=true");
    } else {
      sessionStorage.setItem("login", true);
      fetchMyInfo().then(() => {
        navigate("/?login=true");
      });
    }
  } catch (e) {
    if (e.status === 401) {
      $warning.textContent = "ID or PW is Incorrect";
    }
  }
};

export default fetchSignIn;
