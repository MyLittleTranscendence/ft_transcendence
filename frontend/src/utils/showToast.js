import Toast from "../components/UI/Toast/Toast.js";

const $toastRoot = document.getElementById("toast-container");

const toast = new Toast($toastRoot);
toast.render();

const showToast = (content) => {
  toast.show(content);
};

export default showToast;
