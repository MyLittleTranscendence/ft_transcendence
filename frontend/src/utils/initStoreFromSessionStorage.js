import { myInfoStore, postListStore } from "../store/initialStates.js";

const initPostListFromSessionStorage = () => {
  const myId = myInfoStore.getState().userId;
  const directMessages =
    JSON.parse(sessionStorage.getItem("direct_message")) || [];
  const uniqueSenderIds = [
    ...new Set(directMessages.map((message) => message.sender_id)),
  ];
  const users = uniqueSenderIds
    .filter((senderId) => senderId != myId)
    .map((senderId) => {
      const message = directMessages.find((msg) => msg.sender_id == senderId);
      return {
        userId: message.sender_id,
        nickname: message.sender_nickname,
        profileImage: message.sender_profile_image,
      };
    });
  postListStore.setState({ users });
};

export { initPostListFromSessionStorage };
