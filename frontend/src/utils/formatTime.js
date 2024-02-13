const formatTime = (time) => {
  const now = new Date();
  const inputTime = new Date(time);

  if (inputTime.toDateString() === now.toDateString()) {
    return `Today at ${inputTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
  }
  return inputTime.toLocaleDateString("en-CA");
};

export default formatTime;
