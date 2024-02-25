import Component from "../../core/Component.js";
import FriendsIcon from "../UI/Icon/FriendsIcon.js";
import ProfileImage from "../UI/Profile/ProfileImage.js";
import FriendsList from "../Friend/FriendsList.js";
import BlockList from "../Friend/BlockList.js";
import blockUserHandler from "../../handlers/user/blockUserHandler.js";
import unblockUserHandler from "../../handlers/user/unblockUserHandler.js";
import { myInfoStore } from "../../store/initialStates.js";

import { chatSocket } from "../../socket/socketManager.js";
import sendChatHandler from "../../handlers/chat/sendChatHandler.js";
import ChatInput from "./ChatInput.js";
import DirectMessage from "./DirectMessage.js";

export default class SideBar extends Component {
  setup() {
    const unsubscribe = myInfoStore.subscribe(this);
    this.removeObservers.push(unsubscribe);
  }

  template() {
    return `
      <a 
        id="sidebar-my-profile-link"
        href="/profile?user_id=${myInfoStore.getState().userId}"
        data-link
      ></a>
      <div
        id="friends-icon-holder"
        type="button"
        class="
          position-relative
          d-flex justify-content-center
        "
        data-bs-toggle="modal"
        data-bs-target="#friends-list-modal"
      >
      </div>
      <div id="friends-list-modal" class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Friends</h4>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
              <div id="friends-list-holder" class="modal-body"></div>
              <div class="modal-footer">
                <button class="btn" data-bs-target="#block-list-modal" data-bs-toggle="modal">Block</button>
              </div>
          </div>
        </div>
      </div>

      <div id="block-list-modal" class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">Block</h4>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div id="block-list-holder" class="modal-body"></div>
            <div class="modal-footer">
              <button class="btn" data-bs-target="#friends-list-modal" data-bs-toggle="modal">Back</button>
            </div>
          </div>
        </div>
      </div>
  
      <div class="modal fade" id="dm-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title" id="exampleModalLabel">DM</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

              <div class="card border-0">
                <div class="card-header text-center">
                  <h4 class="text-muted">player1</h4>
                </div>
                <div class="card-body">
                  <div
                    id="dm-chat-message-container"
                    class="w-100 mh-100 overflow-auto mt-1"
                  >
                    <ul
                      id="dm-chat-message-ul"
                      class="list-unstyled"
                    ></ul>
                  </div>
                </div>
                <div class="card-footer">
                  <div id="dm-chat-input"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    `;
  }

  mounted() {
    const myProfile = new ProfileImage(
      this.$target.querySelector("#sidebar-my-profile-link"),
      {
        imageSize: "image-sm",
        imageSrc: myInfoStore.getState().profileImage,
        alt: "my profile",
      }
    );
    const friendsIcon = new FriendsIcon(
      this.$target.querySelector("#friends-icon-holder"),
      { isOnline: true }
    );
    const friendsList = new FriendsList(
      this.$target.querySelector("#friends-list-holder")
    );
    const blockList = new BlockList(
      this.$target.querySelector("#block-list-holder")
    );
    const { addSocketObserver } = chatSocket();
    const chatInput = new ChatInput(
      this.$target.querySelector("#dm-chat-input"),
      { id: "dm-chat-input", name: "dm-chat-input" }
    );
    friendsList.render();
    blockList.render();
    chatInput.render();
    myProfile.render();
    friendsIcon.render();
    const $messageContainer = this.$target.querySelector(
      "#dm-chat-message-container"
    );
    const $messageUL = $messageContainer.querySelector("#dm-chat-message-ul");

    const removeObserver = addSocketObserver("single_message", (message) => {
      const $messageLI = document.createElement("li");
      const directMessage = new DirectMessage($messageLI, {
        content: message.message,
        senderId: message.sender_id,
        senderNickname: message.sender_nickname,
        senderProfileImage: message.sender_profile_image,
        datetime: message.datetime,
      });
      directMessage.render();
      $messageLI.id = `dm-${message.datetime}`;
      $messageUL.appendChild($messageLI);
      $messageContainer.scrollTop = $messageContainer.scrollHeight;
    });
    this.removeObservers.push(removeObserver);
  }

  setEvent() {
    this.addEvent("keydown", "#dm-chat-input", (e) =>
      sendChatHandler(e, "single_message")
    );
    this.addEvent("click", "#global-send-icon", () => {
      const $input = this.$target.querySelector("#dm-chat-input");
      sendChatHandler({ target: $input, key: "Enter" }, "single_message");
    });
  }
}
