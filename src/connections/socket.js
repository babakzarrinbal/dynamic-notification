import config from "./config";
let socket;
if (!config.mock) {
  var io = require("socket.io-client");
  socket = io.connect(config.host + config.socket, {
    upgrade: true,
    transports: ["websocket"],
    reconnect: true,
  });
} else {
  socket = {
    emit() {},
    on() {},
  };
}
export default socket;
