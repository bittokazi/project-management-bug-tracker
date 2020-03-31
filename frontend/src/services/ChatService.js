import io from "socket.io-client";
import config from "./../config";

export default class ChatService {
  constructor() {
    this.connected = false;
    this.onMessageReceive = null;
    this.onDisconnect = null;
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
        .on("authenticated", function() {
          self.connected = true;
          self.listenToMessage();
          self.listentToDisconnect();
          self.getRooms(true).then(rooms => {
            if (callback) callback(rooms);
          });
        })
        .emit("authenticate", {
          token
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
    return new Promise(resolve => {
      this.socket.emit("chat.rooms", rooms => {
        if (join) {
          rooms.forEach(room => {
            self.socket.emit("chat.join", room.roomUid, res => {
              console.log(res);
            });
          });
        }
        return resolve(rooms);
      });
    });
  }

  sendMessage(type, roomUid, message, callback) {
    if (!this.connected) return;
    if (type == "text") {
      this.socket.emit("chat.message.text", roomUid, message, message => {
        callback(message);
      });
    }
  }

  listenToMessage() {
    this.socket.on("chat.message", message => {
      this.onMessageReceive(message);
    });
  }

  fetchChatHistory(roomUid, timestamp, callback) {
    if (!this.connected) return;
    this.socket.emit("chat.history", roomUid, timestamp, messages => {
      callback(messages);
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

  connectChatComponent() {
    if (this.chatComponentConnect) this.chatComponentConnect();
  }
}
