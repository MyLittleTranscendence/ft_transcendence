import Component from "../core/Component.js";
import PageContainerWithLogo from "../components/UI/Container/PageContainerWithLogo.js";
import MatchContainer from "../components/Lobby/MatchContainer.js";
import GlobalChatContainer from "../components/Lobby/GlobalChatContainer.js";
import SideBar from "../components/Lobby/SideBar.js";
import TwoFASwitch from "../components/Lobby/TwoFASwitch.js";
import TwoFAForm from "../components/SignIn/TwoFAForm.js";

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
    const $pageContent = this.$target.querySelector("#lobby-page-content");
    const pageContainer = new PageContainerWithLogo(this.$target, $pageContent);
    const matchContainer = new MatchContainer($pageContent);
    const globalChatContainer = new GlobalChatContainer($pageContent);
    const sideBar = new SideBar($pageContent);

    pageContainer.render();
    matchContainer.render();
    globalChatContainer.render();
    sideBar.render();

    const twoFASwitch = new TwoFASwitch($pageContent);
    const twoFAForm = new TwoFAForm($pageContent);
    twoFASwitch.render();
    twoFAForm.render();
  }
}
