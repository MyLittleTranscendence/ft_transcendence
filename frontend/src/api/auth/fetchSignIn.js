import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";
import fetchUserInfo from "../user/fetchUserInfo.js";

const fetchSignIn = (body) => {
  const { navigate } = getRouter();

  fetchAPI
    .post("/login/default/", body)
    .then((data) => {
      if (data.mfa_require) {
        navigate(`/?mfa_require=true&user_id=${data.user_id}`);
      } else {
        fetchUserInfo(data.user_id);
        navigate("/");
      }
    })
    .catch((error) => console.log(error));
};

export default fetchSignIn;
