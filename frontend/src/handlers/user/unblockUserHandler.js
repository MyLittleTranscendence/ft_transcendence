import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";
import addFriendHandler from "./addFriendHandler.js";
import { blockListStore } from "../../store/initialStates.js";

const unblockUserHandler = (userId) => {
  const currBlocks = blockListStore.getState().blocks;
  const blockToDelete = currBlocks.find((block) => block.userId === userId);

  addFriendHandler(userId);
  fetchAPI
    .delete(`/users/${userId}/blocks/${blockToDelete.blockId}/`)
    .then(() => {
      blockListStore.setState({
        blocks: currBlocks.filter((block) => block.userId !== userId),
      });
    })
    .catch(() => showToast("Failed to delete from your block list."));
};

export default unblockUserHandler;
