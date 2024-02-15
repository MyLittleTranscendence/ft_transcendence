import fetchAPI from "../../utils/fetchAPI.js";
import { myInfoStore } from "../../store/initialStates.js";

const fetchMyInfo = async () => {
  const data = await fetchAPI.get("/me");

  myInfoStore.setState(data);

  return data;
};

export default fetchMyInfo;
