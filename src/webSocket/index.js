var io = require("socket.io-client");
import serverconfig from "../configs";
let socket;
const socketUrl = serverconfig.host + serverconfig.socket;
socket = io.connect(socketUrl, {
  upgrade: true,
  transports: ["websocket"],
  reconnect: true,
});
socket.on("connect", ()=>console.log("connected to webSocket"));
export default socket;
