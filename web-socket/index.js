import { addUser, disconnectUser, getActiveUsers } from "./users.js";
import { setMessage } from "./chat.js";

import { Server } from "socket.io";
import { SOCKET_EVENTS } from "./constants/web-socket-events.js";

export const initWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_PORT || "http://localhost:5000",
      methods: ["GET", "POST"],
    },
  });

  io.on(SOCKET_EVENTS.CONNECT, (socket) => {
    socket.on(SOCKET_EVENTS.JOIN, (username) => {
      onUserJoin(socket, username);
    });

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, (message) => {
      onChatMessage(socket, message);
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      disconnectUser(socket.id);
      console.log('disconnected', socket.id);
      console.log('active sessions:', getActiveUsers().length)

      onDisconnectUser(socket, socket.id);
    });
  });
};

const onUserJoin = (socket, username) => {
  const user = addUser({ name: username, id: socket.id });
  const users = getActiveUsers();

  const dataToUser = {
    currentUser: user,
    activeUsers: users,
  };

  const adminMessage = {
    name: "Admin",
    message: `${username} joined`,
  };

  socket.emit(SOCKET_EVENTS.CONNECT_USER, dataToUser);

  sendMessageToAllClients(socket, adminMessage);
  updateActiveUsersOnAllClients(socket, users);
};

const sendMessageToAllClients = (socket, message) => {
  socket.broadcast.emit(SOCKET_EVENTS.SOCKET_MESSAGE, message);
};

const updateActiveUsersOnAllClients = (socket) => {
  const users = getActiveUsers();

  socket.broadcast.emit(SOCKET_EVENTS.UPDATE_ACTIVE_USERS, users);
};

const onDisconnectUser = (socket, user) => {
  const adminMessage = {
    name: "Admin",
    message: `${user} disconnected`,
  };

  sendMessageToAllClients(socket, adminMessage);
  updateActiveUsersOnAllClients(socket);
};

const onChatMessage = (socket, message) => {
  setMessage(message);
  sendMessageToAllClients(socket, message);
}
