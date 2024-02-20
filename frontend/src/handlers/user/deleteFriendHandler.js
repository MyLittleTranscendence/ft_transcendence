import fetchAPI from "../../utils/fetchAPI.js";
import { friendListStore } from "../../store/initialStates.js";
import showToast from "../../utils/showToast.js";

const deleteFriendHandler = (userId) => {
  const currFriends = friendListStore.getState().friends;

  const friendToDelete = currFriends.find((friend) => friend.userId === userId);

  fetchAPI
    .delete(`/users/${userId}/friends/${friendToDelete.friendId}/`)
    .then(() => {
      friendListStore.setState({
        friends: currFriends.filter((friend) => friend.userId !== userId),
      });
    })
    .catch(() => showToast("Failed to delete from your friend list."));
};

export default deleteFriendHandler;
