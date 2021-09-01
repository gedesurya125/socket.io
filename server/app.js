const express = require('express');
const cors = require('cors');
const http = require('http');
// const socketIo = require('socket.io');
const port = process.env.port || 3001;
const index = require('./routes/index');



const app = express();
app.use(cors());
app.use(index);

const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    method: ['GET', 'POST']
  }
});

const getApiAndEmit = socket => {
  const response = new Date();
  socket.emit("FromAPI", response);
};

let interval;

io.on("connection", (socket)=>{
  console.log("new client connected");
  if(interval){
    clearInterval(interval);
  };

  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("client disconnected");
    clearInterval(interval);
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`));
