const express = require('express');
const path = require('path');
const _ = require('lodash');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

const COMMANDS = ["rock", "paper", "scissors"];
const TIE = "tie";
const PLAYER = "player";
const COMPUTER = "computer";

io.on('connection', function (socket) {
  console.log('a user connected', socket.id);
  socket.on('disconnect', function () {
    console.log('user disconnected', socket.id);
  });
  socket.on('message',(msg, data, fn)=>{
    if (msg == "keepAlive") {
      fn("I won't kill you :)");
    }
  })
});
io.on('ping', (socket)=> {
  console.log('ping...')
})

app.get('/play/:command/:algo*?', (req, res) => {
  const { command, algo } = req.params;
  const myMove = _.sample(COMMANDS);
  const whoWon = checkWin(command, myMove);
  const data = { command, algo, myMove, whoWon };
  console.log(data)
  res.send({ ...data });
  io.emit("play", data)
});


///// FOR PRODUCTION /////
app.use(express.static(path.resolve(__dirname, '..', 'client', 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', `.${req.path}`));
});
///////////////////////////////

http.listen(port, () => console.log(`Listening on port ${port}`));

const checkWin = (playerMove, computer) => {
  if (playerMove == "rock") {
    switch (computer) {
      case "scissors":
        return PLAYER;
      case "paper":
        return COMPUTER;
      default:
        return TIE;

    }
  }
  if (playerMove == "scissors") {
    switch (computer) {
      case "paper":
        return PLAYER;
      case "rock":
        return COMPUTER;
      default:
        return TIE;
    }
  }
  if (playerMove == "paper") {
    switch (computer) {
      case "rock":
        return PLAYER;
      case "scissors":
        return COMPUTER;
      default:
        return TIE;

    }
  }
}
