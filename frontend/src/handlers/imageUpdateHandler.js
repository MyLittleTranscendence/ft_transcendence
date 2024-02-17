import fetchAPI from "../utils/fetchAPI.js";
import { myInfoStore } from "../store/initialStates.js";
import showToast from "../utils/showToast.js";

const imageUpdateHandler = (id) => {
  const fileInput = document.createElement("input");

  fileInput.setAttribute("type", "file");
  fileInput.setAttribute("accept", "image/png");

  fileInput.onchange = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("profile_image", file);
    fetchAPI
      .put(`/users/${id}/profile-image`, formData)
      .then((data) => {
        myInfoStore.setState({ profile_image: data.profile_image });
        showToast("Image updated successfully");
      })
      .catch(() => {
        showToast("Error: failed to update image.");
      });
  };

  fileInput.click();
};

export default imageUpdateHandler;
