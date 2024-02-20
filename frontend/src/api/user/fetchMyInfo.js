import fetchAPI from "../../utils/fetchAPI.js";
import { myInfoStore } from "../../store/initialStates.js";

const fetchMyInfo = async () => {
  const data = await fetchAPI.get("/me/");

  myInfoStore.setState({
    userId: data.id,
    nickname: data.nickname,
    wins: data.wins,
    losses: data.losses,
    profileImage: data.profile_image,
    userName: data.username,
    email: data.email,
    mfaEnable: data.mfa_enable,
  });

  return data;
};

export default fetchMyInfo;
