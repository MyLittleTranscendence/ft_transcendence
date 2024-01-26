const appendCSSLink = (path) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = path;
  document.head.appendChild(link);
};

export default appendCSSLink;
