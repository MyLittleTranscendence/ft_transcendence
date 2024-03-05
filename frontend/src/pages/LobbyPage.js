import Component from "../core/Component.js";
import PageContainerWithLogo from "../components/UI/Container/PageContainerWithLogo.js";
import MatchContainer from "../components/Lobby/MatchContainer.js";
import GlobalChatContainer from "../components/Lobby/GlobalChatContainer.js";
import SideBar from "../components/Lobby/SideBar.js";
import fetchMyInfo from "../api/user/fetchMyInfo.js";
import showToast from "../utils/showToast.js";
import getRouter from "../core/router.js";
import { chatSocket, gameSocket } from "../socket/socket.js";
import fetchFriendList from "../api/user/fetchFriendList.js";
import fetchBlockList from "../api/user/fetchBlockList.js";

export default class LobbyPage extends Component {
  template() {
    return `
    <div
      id="lobby-page-content"
      class="row"
    >
      <div id="match-container"
        class="
          col-md-auto
          d-flex
          flex-column
          align-items-center
          justify-content-between
          p-5 me-4
          border border-white border-5
          position-relative"
        style="width: 20rem;"
      ></div>
      <div
        id="global-chat-container"
        class="
        position-relative
        col
        d-flex
        flex-column
        align-items-center
        border border-white border-5
        p-2
        g-deep-blue-background
        "
        style="height: 35rem;"
      ></div>
      <div id="sidebar"
        class="
          col col-lg-2
          d-flex flex-column align-items-center
          ms-4 gap-3
        "
        style="max-width: 4rem;"
      ></div>
    </div>

    `;
  }

  mounted() {
    this.validateSessionOnSignIn();

    const $pageContent = this.$target.querySelector("#lobby-page-content");
    const pageContainer = new PageContainerWithLogo(this.$target, $pageContent);

    const matchContainer = new MatchContainer(
      $pageContent.querySelector("#match-container"),
      {},
      this
    );
    const globalChatContainer = new GlobalChatContainer(
      $pageContent.querySelector("#global-chat-container"),
      {},
      this
    );
    const sideBar = new SideBar(
      $pageContent.querySelector("#sidebar"),
      {},
      this
    );

    pageContainer.render();
    matchContainer.render();
    globalChatContainer.render();
    sideBar.render();
  }

  validateSessionOnSignIn() {
    const { navigate } = getRouter();
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("login") === "true") {
      fetchMyInfo()
        .then((data) => {
          localStorage.setItem("login", "true");
          showToast(`Welcome, ${data.nickname}!`);
          window.history.replaceState(null, "", "/");
          fetchFriendList();
          fetchBlockList();
          chatSocket();
          gameSocket();
        })
        .catch((e) => {
          showToast(e);
          navigate("/start");
        });
    }
  }
}
