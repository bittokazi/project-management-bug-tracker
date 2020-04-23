import React, { Component } from "react";
import { UserInfoContext } from "./../../../providers/UserInfoProvider";
import { ApiCall } from "./../../../services/NetworkLayer";
import Moment from "react-moment";

let $ = window["$"];

export default class ChatListComponent extends Component {
  static contextType = UserInfoContext;

  constructor(props) {
    super(props);

    this.state = {
      rooms: [],
      selectedRoom: null,
      messages: [],
      text: "",
      timestamp: null,
      chatOpen: true,
      loaded: false,
      users: [],
      showRoom: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      ApiCall().authorized(
        {
          method: "GET",
          url: "/users",
        },
        (response) => {
          this.setState({
            users: response.data.filter(
              (user) => user.id != this.context.user.id
            ),
          });
        },
        (error) => {
          console.log(error.response);
        }
      );
    }, 3000);
  }

  componentWillUnmount() {}

  toggleChatWindow = () => {
    this.state.chatOpen = !this.state.chatOpen;
    this.setState({
      chatOpen: this.state.chatOpen,
    });
    if (this.state.chatOpen) {
      $("#chat").css("display", "block");
      $("#chat-list").css("display", "block");
    } else {
      $("#chat").css("display", "none");
      $("#chat-list").css("display", "none");
    }
  };

  toggleRoomAndUserList() {
    this.state.showRoom = !this.state.showRoom;
    this.setState({
      showRoom: this.state.showRoom,
    });
    if (this.state.showRoom) {
      $("#room-list").css("display", "block");
      $("#user-list").css("display", "none");
    } else {
      $("#room-list").css("display", "none");
      $("#user-list").css("display", "block");
    }
  }

  createRoomForUsers = (user) => {
    this.props.openRoomCreateRoomMode([user]);
  };

  getRoomOnlineStatus = (selectedRoom) => {
    if (this.props.rooms.length > 0) {
      for (let j = 0; j < selectedRoom.users.length; j++) {
        let selectedUser = selectedRoom.users[j];

        for (let i = 0; i < this.props.rooms[0].users.length; i++) {
          let user = this.props.rooms[0].users[i];
          if (
            selectedRoom.type == "general-tenant" &&
            selectedUser.id != this.context.user.id &&
            selectedUser.id == user.id &&
            user.online == 1
          ) {
            return true;
          } else if (
            selectedRoom.type != "general-tenant" &&
            parseInt(selectedUser.userId) != this.context.user.id &&
            parseInt(selectedUser.userId) == user.id &&
            user.online == 1
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  getUserOnlineStatus = (user) => {
    if (this.props.rooms.length > 0) {
      for (let i = 0; i < this.props.rooms[0].users.length; i++) {
        let _user = this.props.rooms[0].users[i];
        if (
          _user.id != this.context.user.id &&
          user.id == _user.id &&
          _user.online == 1
        ) {
          return true;
        }
      }
    }
    return false;
  };

  render() {
    return (
      <>
        <div class="portlet portlet-default">
          <div class="portlet-heading">
            <div class="portlet-title">
              <h4>
                <i class="fa fa-users"></i> Room List
              </h4>
            </div>
            <div class="portlet-widgets">
              <div class="btn-group">
                <button
                  type="button"
                  class="btn btn-white dropdown-toggle btn-xs"
                  data-toggle="dropdown"
                >
                  <i class="fa fa-circle text-green"></i> Status
                  <span class="caret"></span>
                </button>
                <ul class="dropdown-menu" role="menu">
                  <li>
                    <a href="#">
                      <i class="fa fa-circle text-green"></i> Online
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa fa-circle text-orange"></i> Away
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      <i class="fa fa-circle text-red"></i> Offline
                    </a>
                  </li>
                </ul>
              </div>
              <span class="divider"></span>
              <a onClick={() => this.toggleChatWindow()}>
                {this.state.chatOpen && <i class="fa fa-chevron-down"></i>}
                {!this.state.chatOpen && <i class="fa fa-chevron-up"></i>}
              </a>
            </div>
            <div class="clearfix"></div>
          </div>
          {!this.props.connected && (
            <div class="chat-disconnect">
              <div class="cssload-speeding-wheel"></div>
            </div>
          )}
          <div id="chat-list" class="panel-collapse collapse in">
            <div>
              <div class="portlet-body chat-list-widget" id="room-list">
                {this.props.rooms.map((room, key) => (
                  <>
                    <div class="row">
                      <div
                        class="col-lg-12"
                        onClick={() => this.props.openRoom(key)}
                      >
                        <div class="media">
                          <a class="pull-left" href="#">
                            <img
                              class="media-object img-circle img-chat"
                              src="https://bootdey.com/img/Content/avatar/avatar6.png"
                              alt=""
                            />
                          </a>
                          <div class="media-body">
                            <h4 class="media-heading">
                              {this.getRoomOnlineStatus(room) == true && (
                                <i class="fa fa-circle text-green"></i>
                              )}
                              {this.getRoomOnlineStatus(room) == false && (
                                <i class="fa fa-circle text-red"></i>
                              )}{" "}
                              {room.title}
                              {room.unseen > 0 && <> +{room.unseen}</>}
                              <span class="small pull-right">
                                {room.lastMessage.length > 0 && (
                                  <Moment fromNow ago>
                                    {room.lastMessage[0].timestamp}
                                  </Moment>
                                )}
                              </span>
                            </h4>
                            {room.lastMessage.length > 0 && (
                              <p>{room.lastMessage[0].data}</p>
                            )}
                            {room.lastMessage.length < 1 && (
                              <p>Start Typing...</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </>
                ))}
                <div
                  class="row chat-plus-button"
                  onClick={() => this.toggleRoomAndUserList()}
                >
                  <i class="fa fa-plus" aria-hidden="true"></i>
                </div>
              </div>
              <div
                class="portlet-body chat-list-widget"
                style={{ display: "none" }}
                id="user-list"
              >
                {this.state.users.map((user, key) => (
                  <>
                    <div class="row">
                      <div
                        class="col-lg-12"
                        onClick={() => this.createRoomForUsers(user)}
                      >
                        <div class="media">
                          <a class="pull-left" href="#">
                            <img
                              class="media-object img-circle img-chat"
                              src="https://bootdey.com/img/Content/avatar/avatar6.png"
                              alt=""
                            />
                          </a>
                          <div class="media-body">
                            <h4 class="media-heading">
                              {this.getUserOnlineStatus(user) == true && (
                                <i class="fa fa-circle text-green"></i>
                              )}
                              {this.getUserOnlineStatus(user) == false && (
                                <i class="fa fa-circle text-red"></i>
                              )}{" "}
                              {user.username}
                              {/* <span class="small pull-right">12:39 PM</span> */}
                            </h4>
                            {/* <p>Last Message...</p> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr />
                  </>
                ))}
                <div
                  class="row chat-plus-button"
                  onClick={() => this.toggleRoomAndUserList()}
                >
                  <i class="fa fa-arrow-circle-left" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
