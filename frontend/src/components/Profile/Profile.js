import Component from "../../core/Component.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import Overview from "./Overview.js";
import { myInfoStore } from "../../store/initialStates.js";
import imageUpdateHandler from "../../handlers/user/imageUpdateHandler.js";
import Input from "../UI/Input/Input.js";
import nicknameUpdateHandler from "../../handlers/user/nicknameUpdateHandler.js";

export default class Profile extends Component {
  setup() {
    const myInfo = myInfoStore.getState();
    if (this.props.isMe) {
      this.state = {
        userInfo: myInfo,
        isEditingNickname: false,
      };
      const unsubscribe = myInfoStore.subscribe(this);
      this.removeObservers.push(unsubscribe);
    } else {
      // fetch user
    }
  }

  setEvent() {
    if (this.props.isMe) {
      this.addEvent("click", "#profile-image-content", () =>
        imageUpdateHandler(this.state.userInfo.userId)
      );
      this.addEvent("click", "#nickname-edit-icon", () => {
        this.setState({ isEditingNickname: true });
      });
      this.addEvent("click", "#nickname-edit-done-icon", () => {
        const $input = this.$target.querySelector("#nickname-edit-input");
        nicknameUpdateHandler(this.state.userInfo.userId, $input, (isEditing) =>
          this.setState({ isEditingNickname: isEditing })
        );
      });
    }
  }

  template() {
    const { isMe } = this.props;
    const { userInfo, isEditingNickname } = this.state;

    const nickname = isMe ? myInfoStore.getState().nickname : userInfo.nickname;

    return `
      <div class="d-flex flex-column align-items-center">
        <h2 class="text-white fw-bold">
          ${nickname}'s Profile
        </h2>
        <div
          id="profile-image-content"
          class="mb-3"
          ${isMe ? `style="cursor: pointer;"` : ""}
        ></div>
        <div class="d-flex align-items-center position-relative">
          ${
            isMe && !isEditingNickname
              ? `<text class="text-warning fs-5 fw-bold">${nickname}</text>
                <svg id="nickname-edit-icon" class="position-absolute" style="right: -1.5rem; cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-pencil-square" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>`
              : ""
          }
          ${
            isMe && isEditingNickname
              ? `<div id="nickname-edit-input-holder"></div>
                <svg id="nickname-edit-done-icon" class="position-absolute" style="right: -2rem; cursor: pointer;" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#00C213" class="bi bi-check-lg" viewBox="0 0 16 16">
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                </svg>`
              : ""
          }
        </div>
        <br>
        <div id="overview-content"></div>
      </div>
    `;
  }

  mounted() {
    const { userInfo, isEditingNickname } = this.state;
    const { imageSize, alt, isMe } = this.props;
    const myInfo = myInfoStore.getState();

    const profileImage = new ProfileImage(
      this.$target.querySelector("#profile-image-content"),
      {
        imageSize,
        imageSrc: isMe ? myInfo.profileImage : "asset/default.png",
        alt,
      }
    );

    if (isMe && isEditingNickname) {
      const nicknameInput = new Input(
        this.$target.querySelector("#nickname-edit-input-holder"),
        { id: "nickname-edit-input", type: "text", value: myInfo.nickname }
      );
      nicknameInput.render();
    }

    const overview = new Overview(
      this.$target.querySelector("#overview-content"),
      {
        wins: isMe ? myInfo.wins : userInfo.wins,
        losses: isMe ? myInfo.losses : userInfo.losses,
      }
    );
    profileImage.render();
    overview.render();
  }
}
