import fetchAPI from "../../utils/fetchAPI.js";
import getRouter from "../../core/router.js";

const fetchMyInfo = async () => {
  const { navigate } = getRouter();
  try {
    const data = await fetchAPI.get("/me/");

    sessionStorage.setItem("user_id", data.id);
    sessionStorage.setItem("username", data.username);
    sessionStorage.setItem("nickname", data.nickname);
    sessionStorage.setItem("email", data.email);
    sessionStorage.setItem("wins", data.wins);
    sessionStorage.setItem("losses", data.losses);
    sessionStorage.setItem("profile_image", data.profile_image);
    sessionStorage.setItem("mfa_require", data.mfa_enable);

    return data;
  } catch (e) {
    if (e.status === 401) {
      navigate("/start");
    }
    return null;
  }
};

export default fetchMyInfo;
