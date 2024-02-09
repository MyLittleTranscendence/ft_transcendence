import Component from "../core/Component.js";
import PageContainerWithLogo from "../components/UI/Container/PageContainerWithLogo.js";
import MatchContainer from "../components/Lobby/MatchContainer.js";
import GlobalChatContainer from "../components/Lobby/GlobalChatContainer.js";
import SideBar from "../components/Lobby/SideBar.js";
import fetchMyInfo from "../api/user/fetchMyInfo.js";
import showToast from "../utils/showToast.js";
import getRouter from "../core/router.js";

export default class LobbyPage extends Component {
  template() {
    return `
    <div
      id="lobby-page-content"
      class="row"
    >
    </div>
    `;
  }

  mounted() {
    this.validateSessionOnSignIn();

    const $pageContent = this.$target.querySelector("#lobby-page-content");
    const pageContainer = new PageContainerWithLogo(this.$target, $pageContent);
    const matchContainer = new MatchContainer($pageContent);
    const globalChatContainer = new GlobalChatContainer($pageContent);
    const sideBar = new SideBar($pageContent);

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
          sessionStorage.setItem("login", "true");
          showToast(`Welcome, ${data.nickname}!`);
          window.history.replaceState(null, "", "/");
        })
        .catch((e) => {
          showToast(e);
          navigate("/start");
        });
    }
  }
}
