import fetchAPI from "../../utils/fetchAPI.js";

const fetchUserInfo = (userId) => {
  fetchAPI
    .get(`/users/${userId}/`)
    .then((data) => {
      sessionStorage.setItem("username", data.username);
      sessionStorage.setItem("nickname", data.nickname);
      sessionStorage.setItem("email", data.email);
      sessionStorage.setItem("wins", data.wins);
      sessionStorage.setItem("losses", data.losses);
      sessionStorage.setItem("profile_image", data.profile_image);
    })
    .catch((error) => console.error(error));
};

export default fetchUserInfo;
