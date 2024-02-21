document.addEventListener("click", (e) => {
  if (e.target.matches("#friend-item")) console.log("here");
});

function getFriendsList() {
  const friends = [
    {
      profile_image: "/asset/default.png",
      nickname: "Friend1",
      user_id: 1,
      friend_id: 1,
    },
    {
      profile_image: "/asset/default.png",
      nickname: "Friend2",
      user_id: 2,
      friend_id: 2,
    },
  ];

  if (friends.length === 0) {
    return `
        <div class="d-flex justify-content-center">
          <h4 class="fw-bold g-light-grey">No friends.</h4>
        </div>
      `;
  }

  return `
      <div
        class="list-group list-group-flush"
      >
        ${friends
          .map(
            (friend) => `
            <div
              class="dropdown dropend"
            >
              <div
                id="friend-item"
                class="
                  list-group-item
                  list-group-item-action
                  d-flex
                  align-items-center
                  dropdown-toggle
                "
                type="button"
                data-bs-toggle="dropdown"
              >
                <div
                  class="overflow-hidden rounded-circle"
                  style="width: 4rem; height: 4rem;"
                >
                  <img
                    src=${friend.profile_image}
                    class="img-fluid"
                    alt="default"
                  >
                </div>
                <span
                  class="mx-3"
                >
                  <h5 class="fw-bold mb-1">${friend.nickname}</h5>
                  <small class="g-light-grey">click here to send message</small>
                </span>
              </div>
              <ul class="dropdown-menu" data-user-id="${friend.user_id}">
                <li><button class="dropdown-item">DM</button></li>
                <li><a
                  href="/profile?user_id=${friend.user_id}"
                  class="dropdown-item"
                  data-bs-dismiss="modal"
                  data-link
                  >
                    Profile
                </a></li>
                <li><button class="dropdown-item">1 vs 1</button></li>
                <li><hr class="dropdown-divider"></li>
                <li><button class="dropdown-item text-danger">Block</button></li>
              </ul>
            </div>
          `
          )
          .join("")}
      </div>
    `;
}

export default getFriendsList;
