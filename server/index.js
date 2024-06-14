const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
app.use(cors());
const schemma = require("./schemaa");
const server = http.createServer(app);
const CHAT_BOT = "ChatBot";
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const mongoose = require("mongoose");
const { connected } = require("process");
async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://officialiitianaditya:*@cluster0.isqcqqp.mongodb.net/"
    );
    console.log("databses connected");
    // Other code that depends on the successful connection
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}
// main().then(()=>{
//   console.log("databse connnected");
// });main
main();
// const tt=async()=>{
//   const data={username:"aditya",message:"aman",room:"1044",__createdtime__:};
//   let da=await schemma(data).save();
//   console.log(da,"datastores");
// }
// tt();
async function getMessages(room) {
  if (!room) return null;

  try {
    // Query the database for messages in the specified room
    const messages = await schemma.find({ room: room }).limit(100);
    return messages;
  } catch (error) {
    console.error("Error getting messages from the database:", error);
    throw error;
  }
}

io.on("connection", (socket) => {
  console.log(`CONNECTED USER ${socket.id}`);

  socket.on("send_message", async (data) => {
    let { username, room, message } = data;
    let __createdtime__ = Date.now();
    if (!username) username = "anonymous";
    if (!room) room = "anonymous";

    const newMessage = new schemma({
      username,
      room,
      message,
      __createdtime__,
    });
   
    // console.log(bc);

    socket.emit("receive_message", {
      message: message,
      username: username,
      __createdtime__,
    });

    let bc = await newMessage.save();
  });
  socket.on("join_room", async(data) => {
    const { username, room } = data; // Data sent from client when join_room event emitted
    socket.join(room); // Join the user to a socket room
    // console.log(data);
    let __createdtime__ = Date.now(); // Current timestamp
    // Send message to all users currently in the room, apart from the user that just joined
    socket.to(room).emit("receive_message", {
      message: `${username} has joined the chat room`,
      username: CHAT_BOT,
      __createdtime__,
    });
    socket.emit("receive_message", {
      message: `Welcome ${username}`,
      username: CHAT_BOT,
      __createdtime__,
    });


    const messages = await getMessages(room);
    // console.log(messages);
    socket.emit('last_100_messages', JSON.stringify(messages));
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start the HTTP server, not the Express app
server.listen(4000, () => {
  console.log("Server is working on port 4000");
});
