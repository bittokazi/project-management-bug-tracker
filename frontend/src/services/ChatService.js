import io from "socket.io-client";
import config from "./../config";

export default class ChatService {
  constructor() {
    this.connected = false;
    this.onMessageReceive = null;
    this.onUserSpace = null;
    this.onDisconnect = null;
    this.onUserStatus = null;
    this.onRoomList = null;
    console.log("Chat Service Initiated");
    this.connectChat = false;
    this.chatComponentConnect = null;
    this.token = null;
  }

  connect(callback, token) {
    this.token = token;
    let self = this;
    this.socket = io.connect(config.CHAT_SERVER_URL);
    this.socket.on("connect", () => {
      self.socket
        .on("authenticated", function () {
          self.connected = true;
          self.listenToMessage();
          self.listenToUserSpace();
          self.listentToDisconnect();
          self.listenToOnUserStatus();
          self.getRooms(true).then((rooms) => {
            if (callback) callback(rooms);
            if (self.onRoomList) self.onRoomList(rooms);
          });
        })
        .emit("authenticate", {
          token,
        });
    });
  }

  disconnect() {
    if (this.socket) this.socket.close();
    this.connected = false;
  }

  listentToDisconnect() {
    this.socket.on("disconnect", () => {
      this.onDisconnect();
      this.disconnect();
      this.connect(null, this.token);
    });
  }

  getRooms(join = false) {
    if (!this.connected) return;
    let self = this;
    return new Promise((resolve) => {
      this.socket.emit("chat.rooms", (rooms) => {
        if (join) {
          rooms.forEach((room) => {
            self.socket.emit("chat.join", room.roomUid, (res) => {
              console.log(res);
            });
          });
        }
        return resolve(rooms);
      });
    });
  }

  joinRoom(roomUid, callback) {
    this.socket.emit("chat.join", roomUid, (res) => {
      console.log(res);
      callback();
    });
  }

  sendMessage(type, roomUid, message, callback) {
    if (!this.connected) return;
    if (type == "text") {
      this.socket.emit("chat.message.text", roomUid, message, (message) => {
        callback(message);
      });
    }
  }

  listenToMessage() {
    this.socket.on("chat.message", (message) => {
      this.onMessageReceive(message);
    });
  }

  listenToUserSpace() {
    this.socket.on("chat.user.space", (data) => {
      this.onUserSpace(data);
    });
  }

  listenToOnUserStatus() {
    this.socket.on("chat.user.status", (data) => {
      this.onUserStatus(data);
    });
  }

  fetchChatHistory(roomUid, timestamp, callback) {
    if (!this.connected) return;
    this.socket.emit("chat.history", roomUid, timestamp, (messages) => {
      callback(messages);
    });
  }

  createRoom(users, callback) {
    this.socket.emit("chat.create.room", users, (room) => {
      callback(room);
    });
  }

  updateSeen(roomUid, callback) {
    if (!this.connected) return;
    this.socket.emit("chat.update.seen", roomUid, (res) => {
      console.log("lastseen", res);
      callback(res);
    });
  }

  setOnMessageReceive(callback) {
    this.onMessageReceive = callback;
  }

  setOnDisconnect(callback) {
    this.onDisconnect = callback;
  }

  setChatComponentConnect(callback) {
    this.chatComponentConnect = callback;
  }

  setOnUserSpace(callback) {
    this.onUserSpace = callback;
  }

  setOnUserStatus(callback) {
    this.onUserStatus = callback;
  }

  setOnRoomList(callback) {
    this.onRoomList = callback;
  }

  connectChatComponent() {
    if (this.chatComponentConnect) this.chatComponentConnect();
  }
}
