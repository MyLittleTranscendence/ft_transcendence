import fetchAPI from "../../utils/fetchAPI.js";
import showToast from "../../utils/showToast.js";
import { blockListStore } from "../../store/initialStates.js";

const fetchBlocks = async () => {
  try {
    const data = await fetchAPI.get("/blocks/");
    const blockList = data.results.map((block) => ({
      blockId: block.block_id,
      userId: block.user_id,
      nickname: block.nickname,
      profileImage: block.profile_image,
    }));

    blockListStore.setState({ blocks: blockList, isFetched: true });
  } catch (e) {
    showToast("Failed to load block list.");
  }
};

export default fetchBlocks;
