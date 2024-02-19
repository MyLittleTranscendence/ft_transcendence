import fetchNickname from "../../api/user/fetchNickname.js";

const handleSubmitNickname = (event) => {
  event.preventDefault();
  const body = {
    nickname: event.srcElement.querySelector("#nickname-input").value,
  };

  fetchNickname(body);
};

export default handleSubmitNickname;
