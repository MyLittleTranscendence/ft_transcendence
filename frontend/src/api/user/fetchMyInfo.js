import fetchAPI from "../../utils/fetchAPI.js";

const fetchMyInfo = async () => {
  const data = await fetchAPI.get("/me");

  sessionStorage.setItem("user_id", data.id);
  sessionStorage.setItem("username", data.username);
  sessionStorage.setItem("nickname", data.nickname);
  sessionStorage.setItem("email", data.email);
  sessionStorage.setItem("wins", data.wins);
  sessionStorage.setItem("losses", data.losses);
  sessionStorage.setItem("profile_image", data.profile_image);
  sessionStorage.setItem("mfa_require", data.mfa_enable);

  return data;
};

export default fetchMyInfo;
