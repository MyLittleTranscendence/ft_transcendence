import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";
import deleteFriendHandler from "./deleteFriendHandler.js";
import { blockListStore } from "../../store/initialStates.js";

const blockUserHandler = (userId) => {
  deleteFriendHandler(userId);
  fetchAPI
    .post(`/users/${userId}/blocks/`)
    .then((data) => {
      const blockList = blockListStore.getState().blocks;
      blockList.push({
        blockId: data.block_id,
        userId: data.user_id,
        profileImage: data.profile_image,
        nickname: data.nickname,
      });
      blockListStore.setState({ blocks: blockList });
    })
    .catch(() => showToast("Failed to add to blocks."));
};

export default blockUserHandler;
