import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";
import { friendListStore } from "../../store/initialStates.js";

const addFriendHandler = (userId) => {
  fetchAPI
    .post(`/users/${userId}/friends/`)
    .then((data) => {
      const friendList = friendListStore.getState().friends;
      friendList.push({
        friendId: data.friend_id,
        userId: data.user_id,
        profileImage: data.profile_image,
        nickname: data.nickname,
      });
      friendListStore.setState({ friends: friendList });
    })
    .catch(() => showToast("Failed to add to friends."));
};

export default addFriendHandler;
