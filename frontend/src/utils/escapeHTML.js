const sequence = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escapeHtml = (str) => str.replace(/[&<>"']/g, (char) => sequence[char]);

export default escapeHtml;
