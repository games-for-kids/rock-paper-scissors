import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';
import IntroImage from './assets/intro.jpg';
import GameView from './GameView';

const DEV_SERVER = "http://localhost:5000";
const PROD_SERVER = 'https://the-game-rock-paper-scissors.herokuapp.com';

const PAPER = "✋";
const ROCK = "👊";
const SCISSORS = "✌️";

const IntroBackgroundColor = '#cb8a51';

class App extends Component {
  state = {
    round: 0,
    playerWins: 0,
    compuerWins: 0,
    started: false,
    hasData: false,
    data: {},
  };

  componentDidMount() {
    if (process.env.NODE_ENV === "production") {
      this.socket = io();
    } else {
      this.socket = io("http://localhost:5000");
    }
    this.socket.on("play", (data) => {
      if (!this.state.started) {
        return false;
      }
      let { playerWins, compuerWins } = this.state;
      if (data.whoWon === "player") {
        playerWins++;
      } else if (data.whoWon === "computer") {
        compuerWins++;
      }
      this.setState({ hasData: true, data: data, playerWins, compuerWins, round: this.state.round + 1 });
    })
    //to keep the connection alive in heroku env
    setInterval(() => this.socket.send('keepAlive', { t: Date.now() }, (msg) => console.log(msg)), 25 * 1000);
  }

  play(command) {
    if (process.env.NODE_ENV === "production") {
      fetch(`/play/${command}`)
    } else {
      fetch(`http://localhost:5000/play/${command}`)
    }
  }

  render() {
    const { myMove, whoWon, command } = this.state.data;
    const { started, hasData } = this.state;
    const emoji = this.getEmoji(myMove);
    if (!started || !hasData) {
      return <Intro started={started} startGame={e => this.setState({ started: true })} />
    }
    return <GameView player={this.getEmoji(command)} computer={this.getEmoji(myMove)} whoWon={whoWon} />
  }

  getEmoji(myMove) {
    if (myMove === "rock") return ROCK;
    if (myMove === "paper") return PAPER;
    if (myMove === "scissors") return SCISSORS;
  }
}

const Intro = ({ startGame, started }) =>
  <div style={{ backgroundColor: IntroBackgroundColor }}>
    <img
      style={{ margin: '0 auto', display: 'block' }}
      src={IntroImage}
      height={window.screen.availHeight - 80} />
    <div style={{
      position: "absolute",
      zIndex: 10000,
      top: 550,
      width: "100%"
    }}>
      {!started &&
        <div onClick={e => startGame()}
          style={{
            padding: 20,
            backgroundColor: "blue",
            width: 200,
            color: "white",
            border: "1px solid white",
            borderRadius: "5px",
            margin: '0 auto',
            textAlign: "center",
            cursor: "pointer",
          }}
        >START</div>}
      {started && 
        <div onClick={e => startGame()}
        style={{
          padding: 20,
          backgroundColor: "green",
          width: 200,
          color: "white",
          border: "1px solid white",
          borderRadius: "5px",
          margin: '0 auto',
          textAlign: "center",
        }}
      >Waiting For Your Move</div>}
      }
    </div>
  </div>

const TotalScore = ({ playerWins, compuerWins }) => {
  const playerIcon = playerWins > compuerWins ? '⭐' : ''
  const computerIcon = playerWins < compuerWins ? '⭐' : ''
  return (
    <div>
      <div>{`🙎‍♀️ Your score: ${playerWins} ${playerIcon}`}</div>
      <div>{`🖥 My score: ${compuerWins} ${computerIcon}`}</div>
    </div>)
}


export default App;


