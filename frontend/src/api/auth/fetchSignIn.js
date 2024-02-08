import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";

const fetchSignIn = async (body, $query) => {
  const { navigate } = getRouter();
  const $warning = $query;

  try {
    const data = await fetchAPI.post("/login/default/", body);

    if (data.mfa_require) {
      navigate(`/?mfa_require=true&user_id=${data.user_id}`);
    } else {
      navigate(`/?mfa_require=false&user_id=${data.user_id}`);
    }
  } catch (e) {
    $warning.textContent = "ID or PW is Incorrect";
  }
};

export default fetchSignIn;
