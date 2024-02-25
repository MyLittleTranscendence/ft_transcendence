import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";
import { friendListStore } from "../../store/initialStates.js";

const fetchFriendList = async () => {
  try {
    const data = await fetchAPI.get("/friends/");
    const friendList = data.results.map((friend) => ({
      friendId: friend.friend_id,
      userId: friend.user_id,
      nickname: friend.nickname,
      profileImage: friend.profile_image,
    }));

    friendListStore.setState({ friends: friendList, isFetched: true });
  } catch (e) {
    showToast("Failed to load friend list.");
  }
};

export default fetchFriendList;
