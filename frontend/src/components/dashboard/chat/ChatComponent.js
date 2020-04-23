import React, { Component } from "react";
import { UserInfoContext } from "./../../../providers/UserInfoProvider";
import { ApiCall } from "./../../../services/NetworkLayer";
import ChatListComponent from "./ChatListComponent";

let $ = window["$"];

export default class ChatComponent extends Component {
  static contextType = UserInfoContext;

  constructor(props) {
    super(props);

    this.state = {
      rooms: [],
      selectedRoom: null,
      messages: [],
      text: "",
      timestamp: null,
      chatOpen: false,
      loaded: false,
      roomCreateMode: false,
      createRoomUsers: [],
      users: [],
      connected: false,
    };
  }

  componentDidMount() {
    this.context.chat.setChatComponentConnect(this.connect);
    this.connect();
  }

  connect = () => {
    if (this.context.user != null)
      console.log("tenant", this.context.user.tenant);

    if (
      (this.context.user != null && this.context.user.role != "superAdmin") ||
      (this.context.user != null &&
        this.context.user.role == "superAdmin" &&
        this.context.user.tenant != "")
    ) {
      if (
        !this.context.chat.connected &&
        this.context.chat.connectChat &&
        !this.state.loaded
      ) {
        ApiCall().authorized(
          {
            method: "GET",
            url: "/users/chat/token",
          },
          (resolve) => {
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
                this.context.chat.connect((rooms) => {
                  this.context.chat.setOnMessageReceive(
                    this.onNewMessageReceived
                  );
                  this.context.chat.setOnUserSpace(this.onUserSpace);
                  this.context.chat.setOnDisconnect(
                    this.onChatServerDisconnect
                  );
                  this.context.chat.setOnUserStatus(this.onUserStatus);
                  this.context.chat.setOnRoomList(this.onRoomList);
                  setTimeout(() => {
                    this.setState({
                      connected: true,
                      rooms: rooms.map((room) => {
                        if (room.type == "customRoom")
                          room.users.forEach((_user) => {
                            this.state.users.forEach((user) => {
                              if (user.id == _user.userId) {
                                room.title = user.username;
                              }
                            });
                          });
                        return room;
                      }),
                    });
                    let self = this;
                    $("#chat-box").scroll(function () {
                      if ($(this).scrollTop() === 0) {
                        self.onScrolltoTop();
                      }
                    });
                  }, 500);
                }, resolve.data.token);
              },
              (error) => {
                console.log(error.response);
              }
            );
            console.log(resolve.data);
          },
          (reject) => {}
        );
        this.state.loaded = true;
      }
    }
  };

  componentWillUnmount() {
    this.context.chat.disconnect();
    this.context.chat.setChatComponentConnect(null);
    this.context.chat.setOnRoomList(null);
  }

  onRoomList = (rooms) => {
    this.setState({
      connected: true,
    });
    this.setState({
      rooms: rooms.map((room) => {
        if (room.type == "customRoom")
          room.users.forEach((_user) => {
            this.state.users.forEach((user) => {
              if (user.id == _user.userId) {
                room.title = user.username;
              }
            });
          });
        return room;
      }),
    });
  };

  onChatServerDisconnect = () => {
    console.log("disconnected");
    this.setState({
      connected: false,
    });
  };

  onScrolltoTop = () => {
    this.fetchHistoryOfRoom(
      this.state.selectedRoom.roomUid,
      this.state.timestamp
    );
  };

  fetchHistoryOfRoom(roomUid, timestamp = null, scroll = false) {
    let prevHeight = $("#chat-box").prop("scrollHeight");
    this.context.chat.fetchChatHistory(roomUid, timestamp, (messages) => {
      if (messages.length > 0) {
        this.setState({
          timestamp: messages[0].timestamp,
          messages: [...messages, ...this.state.messages],
        });
        setTimeout(() => {
          if (!scroll) {
            let curHeight = $("#chat-box").prop("scrollHeight");
            let scrollToHeight = curHeight - prevHeight;
            $("#chat-box").scrollTop(scrollToHeight);
          }
        }, 300);
        if (scroll) {
          $("#chat-box").animate(
            { scrollTop: $("#chat-box").prop("scrollHeight") },
            1000
          );
        }
      }
    });
  }

  onNewMessageReceived = (message) => {
    if (
      this.state.chatOpen &&
      !this.state.roomCreateMode &&
      this.state.selectedRoom.roomUid == message.roomUid
    ) {
      this.setState({
        messages: [...this.state.messages, message],
      });
      $("#chat-box").animate(
        { scrollTop: $("#chat-box").prop("scrollHeight") },
        1000
      );
      this.context.chat.updateSeen(message.roomUid, () => {});
      this.state.rooms.forEach((room) => {
        if (room.roomUid == message.roomUid) {
          room.lastMessage = [message];
          this.setState({
            rooms: this.state.rooms,
          });
        }
      });
    } else {
      this.state.rooms.forEach((room) => {
        if (room.roomUid == message.roomUid) {
          room.unseen += 1;
          room.lastMessage = [message];
          this.setState({
            rooms: this.state.rooms,
          });
        }
      });
    }
  };

  onUserSpace = (room) => {
    if (!this.state.createdBy != this.context.user.id) {
      this.context.chat.joinRoom(room.id, () => {
        this.context.chat.getRooms(false).then((rooms) => {
          for (let i = 0; i < rooms.length; i++) {
            if (room.id == rooms[i].roomUid) {
              this.setState({
                rooms: rooms.map((_room) => {
                  if (_room.type == "customRoom")
                    _room.users.forEach((_user) => {
                      this.state.users.forEach((user) => {
                        if (user.id == _user.userId) {
                          _room.title = user.username;
                        }
                      });
                    });
                  return _room;
                }),
              });
              break;
            }
          }
        });
      });
    }
  };

  onUserStatus = (data) => {
    this.state.rooms.forEach((room, key) => {
      if (room.type == "general-tenant" && room.roomUid == data.user.roomUid) {
        room.users.forEach((user, _key) => {
          if (data.user.id == user.id) {
            this.state.rooms[key].users[_key].online = data.user.status;
            this.setState({
              rooms: this.state.rooms,
            });
          }
        });
      }
    });
  };

  onSendNewMessage = () => {
    if (this.state.roomCreateMode) {
      this.context.chat.createRoom(this.state.createRoomUsers, (room) => {
        this.context.chat.joinRoom(room.id, () => {
          this.context.chat.getRooms(false).then((rooms) => {
            this.setState({
              rooms: rooms.map((_room) => {
                if (_room.type == "customRoom")
                  _room.users.forEach((_user) => {
                    this.state.users.forEach((user) => {
                      if (user.id == _user.userId) {
                        _room.title = user.username;
                      }
                    });
                  });
                return _room;
              }),
              roomCreateMode: false,
              chatOpen: true,
              timestamp: null,
              messages: [],
            });
            for (let i = 0; i < rooms.length; i++) {
              if (room.id == rooms[i].roomUid) {
                this.setState({
                  selectedRoom: rooms[i],
                });
                break;
              }
            }
            this.context.chat.sendMessage(
              "text",
              this.state.selectedRoom.roomUid,
              this.state.text,
              (message) => {
                console.log("sent", message);
              }
            );
            this.setState({
              text: "",
            });
          });
        });
      });
      return;
    }
    this.context.chat.sendMessage(
      "text",
      this.state.selectedRoom.roomUid,
      this.state.text,
      (message) => {
        console.log("sent", message);
      }
    );
    this.setState({
      text: "",
    });
  };

  updateText = (event, field) => {
    let fieldObject = {};
    fieldObject[field] = event.target.value;
    this.setState(fieldObject);
  };

  openRoom = (index) => {
    this.setState({
      selectedRoom: this.state.rooms[index],
      chatOpen: true,
      timestamp: null,
      messages: [],
      roomCreateMode: false,
    });
    setTimeout(() => {
      this.fetchHistoryOfRoom(
        this.state.selectedRoom.roomUid,
        this.state.timestamp,
        true
      );
      this.context.chat.updateSeen(this.state.rooms[index].roomUid, (res) => {
        this.state.rooms.forEach((room) => {
          if (room.roomUid == this.state.rooms[index].roomUid) {
            room.unseen = 0;
            this.setState({
              rooms: this.state.rooms,
            });
          }
        });
      });
    }, 300);
  };

  closeChatWindow = () => {
    this.setState({
      chatOpen: false,
      messages: [],
    });
  };

  openRoomCreateRoomMode = (createRoomUsers) => {
    let found = false;
    let users = [];
    createRoomUsers.forEach((user) => {
      users.push(parseInt(user.id));
    });
    users.push(this.context.user.id);
    this.state.rooms.forEach((room, index) => {
      let _users = room.users.map((u) => parseInt(u.userId));
      if (users.sort().join("-") == _users.sort().join("-")) {
        this.openRoom(index);
        found = true;
      }
    });
    if (found) return;
    this.setState({
      messages: [],
      chatOpen: true,
      roomCreateMode: true,
      createRoomUsers,
      selectedRoom: {
        title: createRoomUsers[0].username,
      },
    });
  };

  getRoomOnlineStatus = () => {
    if (
      !this.state.roomCreateMode &&
      this.state.rooms.length > 0 &&
      this.state.selectedRoom.users
    ) {
      for (let j = 0; j < this.state.selectedRoom.users.length; j++) {
        let selectedUser = this.state.selectedRoom.users[j];
        for (let i = 0; i < this.state.rooms[0].users.length; i++) {
          let user = this.state.rooms[0].users[i];
          if (
            this.state.selectedRoom.type == "general-tenant" &&
            selectedUser.id != this.context.user.id &&
            selectedUser.id == user.id &&
            user.online == 1
          ) {
            return true;
          } else if (
            this.state.selectedRoom.type != "general-tenant" &&
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

  render() {
    console.log("rooms", this.state.rooms);

    return (
      <>
        <div class="container bootstrap snippet">
          <div class="row">
            <div
              class="col-md-5"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
              }}
            >
              <ChatListComponent
                rooms={this.state.rooms}
                openRoom={this.openRoom}
                openRoomCreateRoomMode={this.openRoomCreateRoomMode}
                connected={this.state.connected}
              />
            </div>
            <>
              {this.state.chatOpen && (
                <div
                  class="col-md-4"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: "456px",
                  }}
                >
                  {/* {this.state.rooms.map((room) => ( */}
                  <div class="portlet portlet-default">
                    <div class="portlet-heading">
                      <div class="portlet-title">
                        <h4>
                          {this.getRoomOnlineStatus() == true && (
                            <i class="fa fa-circle text-green"></i>
                          )}
                          {this.getRoomOnlineStatus() == false && (
                            <i class="fa fa-circle text-red"></i>
                          )}{" "}
                          {this.state.selectedRoom.title}
                        </h4>
                      </div>
                      <div
                        class="portlet-widgets"
                        style={{ "padding-top": "3px" }}
                      >
                        <span class="divider"></span>
                        <a
                          onClick={() => this.closeChatWindow()}
                          class="chat-window-close-btn"
                        >
                          <i class="fa fa-times-circle "></i>
                        </a>
                      </div>
                      <div class="clearfix"></div>
                    </div>
                    {!this.state.connected && (
                      <div class="chat-disconnect">
                        <div class="cssload-speeding-wheel"></div>
                      </div>
                    )}
                    <div id="chat" class="panel-collapse collapse in">
                      <div>
                        <div class="portlet-body chat-widget" id="chat-box">
                          <div class="row">
                            <div class="col-lg-12">
                              <p class="text-center text-muted small">
                                January 1, 2014 at 12:23 PM
                              </p>
                            </div>
                          </div>
                          {this.state.messages.map((message) => (
                            <>
                              <div class="row">
                                <div class="col-lg-12">
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
                                        {message.senderName}
                                        <span class="small pull-right">
                                          12:39 PM
                                        </span>
                                      </h4>
                                      <p>{message.data}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <hr />
                            </>
                          ))}
                        </div>
                      </div>
                      <div class="portlet-footer">
                        <form role="form">
                          <div class="form-group">
                            <textarea
                              class="form-control"
                              placeholder="Enter message..."
                              value={this.state.text}
                              onChange={(event) =>
                                this.updateText(event, "text")
                              }
                            ></textarea>
                          </div>
                          <div class="form-group">
                            <button
                              type="button"
                              class="btn btn-default pull-right"
                              onClick={() => this.onSendNewMessage()}
                            >
                              Send
                            </button>
                            <div class="clearfix"></div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  {/* ))} */}
                </div>
              )}
            </>
          </div>
        </div>
      </>
    );
  }
}
