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
      "mongodb+srv://officialiitianaditya:<password>@cluster0.isqcqqp.mongodb.net/"
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

    try {
      console.log("lss before save");
      let bc = await newMessage.save();
      console.log("lss after save");
//socket to send message to everyone in same room excepr itseld
      io.in(room).emit("receive_message", {
        message: message,
        username: username,
        __createdtime__,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("join_room", async (data) => {
    const { username, room } = data;
    socket.join(room);

    let __createdtime__ = Date.now();
    socket.to(room).emit("receive_message", {
      message: `${username} has joined the chat room`,
      username: "CHAT_BOT",
      __createdtime__,
    });

    socket.emit("receive_message", {
      message: `Welcome ${username}`,
      username: "CHAT_BOT",
      __createdtime__,
    });

    try {
      const messages = await getMessages(room);
      socket.emit('last_100_messages', JSON.stringify(messages));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  });
});


app.get("/", (req, res) => {
  res.send("Server is running");
});

// Start the HTTP server, not the Express app
server.listen(4000, () => {
  console.log("Server is working on port 4000");
});
