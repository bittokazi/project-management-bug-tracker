import React, { Component } from "react";
import { UserInfoContext } from "./../../../providers/UserInfoProvider";
import { ApiCall } from "./../../../services/NetworkLayer";

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
      chatOpen: true,
      loaded: false
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
            url: "/users/chat/token"
          },
          resolve => {
            console.log(resolve.data);

            this.context.chat.connect(rooms => {
              this.context.chat.setOnMessageReceive(this.onNewMessageReceived);
              this.context.chat.setOnDisconnect(this.onChatServerDisconnect);
              setTimeout(() => {
                this.setState({
                  rooms,
                  selectedRoom: rooms[0]
                });
                this.fetchHistoryOfRoom(
                  rooms[0].roomUid,
                  this.state.timestamp,
                  true
                );
                let self = this;
                $("#chat-box").scroll(function() {
                  if ($(this).scrollTop() === 0) {
                    self.onScrolltoTop();
                  }
                });
              }, 500);
            }, resolve.data.token);
          },
          reject => {}
        );
        this.state.loaded = true;
      }
    }
  };

  componentWillUnmount() {
    this.context.chat.disconnect();
    this.context.chat.setChatComponentConnect(null);
  }

  onChatServerDisconnect = () => {
    console.log("disconnected");
  };

  onScrolltoTop = () => {
    this.fetchHistoryOfRoom(
      this.state.selectedRoom.roomUid,
      this.state.timestamp
    );
  };

  fetchHistoryOfRoom(roomUid, timestamp = null, scroll = false) {
    let prevHeight = $("#chat-box").prop("scrollHeight");
    this.context.chat.fetchChatHistory(roomUid, timestamp, messages => {
      if (messages.length > 0) {
        this.setState({
          timestamp: messages[0].timestamp,
          messages: [...messages, ...this.state.messages]
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

  onNewMessageReceived = message => {
    console.log("nmmmm", this.state);
    this.setState({
      messages: [...this.state.messages, message]
    });
    $("#chat-box").animate(
      { scrollTop: $("#chat-box").prop("scrollHeight") },
      1000
    );
  };

  onSendNewMessage = () => {
    this.context.chat.sendMessage(
      "text",
      this.state.rooms[0].roomUid,
      this.state.text,
      message => {
        console.log("sent", message);
      }
    );
    this.setState({
      text: ""
    });
  };

  updateText = (event, field) => {
    let fieldObject = {};
    fieldObject[field] = event.target.value;
    this.setState(fieldObject);
  };

  toggleChatWindow = () => {
    this.state.chatOpen = !this.state.chatOpen;
    this.setState({
      chatOpen: this.state.chatOpen
    });
    if (this.state.chatOpen) {
      $("#chat").css("display", "block");
    } else {
      $("#chat").css("display", "none");
    }
  };

  render() {
    return (
      <>
        <div class="container bootstrap snippet">
          <div class="row">
            <div class="col-md-4 col-md-offset-8">
              {this.state.rooms.map(room => (
                <div class="portlet portlet-default">
                  <div class="portlet-heading">
                    <div class="portlet-title">
                      <h4>
                        <i class="fa fa-circle text-green"></i> General Room
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
                        {this.state.chatOpen && (
                          <i class="fa fa-chevron-down"></i>
                        )}
                        {!this.state.chatOpen && (
                          <i class="fa fa-chevron-up"></i>
                        )}
                      </a>
                    </div>
                    <div class="clearfix"></div>
                  </div>
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
                        {this.state.messages.map(message => (
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
                            onChange={event => this.updateText(event, "text")}
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
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }
}
