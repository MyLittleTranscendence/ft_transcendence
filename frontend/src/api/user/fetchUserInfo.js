import fetchAPI from "../../utils/fetchAPI.js";

const fetchUserInfo = (userId) =>
  fetchAPI
    .get(`/users/${userId}/`)
    .then(
      (data) =>
        // sessionStorage.setItem("user_id", data.id);
        // sessionStorage.setItem("nickname", data.nickname);
        // sessionStorage.setItem("wins", data.wins);
        // sessionStorage.setItem("losses", data.losses);
        // sessionStorage.setItem("profile_image", data.profile_image);
        data
    )
    .catch((error) => console.error(error));

export default fetchUserInfo;
