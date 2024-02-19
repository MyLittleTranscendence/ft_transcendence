import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";

const fetchUserInfo = async (userId) => {
  try {
    const data = await fetchAPI.get(`/users/${userId}/`);
    return {
      userId: data.id,
      nickname: data.nickname,
      wins: data.wins,
      losses: data.losses,
      profileImage: data.profile_image,
    };
  } catch (e) {
    showToast("Failed to load user data.");
    return null;
  }
};

export default fetchUserInfo;
