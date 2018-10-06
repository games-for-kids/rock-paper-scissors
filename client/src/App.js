import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';
import GameView from './GameView';

const DEV_SERVER = "http://localhost:5000";
const PROD_SERVER = 'https://the-game-rock-paper-scissors.herokuapp.com';

const PAPER = "✋";
const ROCK = "👊";
const SCISSORS = "✌️";


class App extends Component {
  state = {
    round: 0,
    playerWins: 0,
    compuerWins: 0,
    started: false,
    hasData: false,
    showComputerState: false,
    data: {},
  };

  componentDidMount() {
    if (process.env.NODE_ENV === "production") {
      this.socket = io();
    } else {
      this.socket = io("http://localhost:5000");
    }
    this.socket.on("play", (data) => {
      let { playerWins, compuerWins } = this.state;
      if (data.whoWon === "player") {
        playerWins++;
      } else if (data.whoWon === "computer") {
        compuerWins++;
      }
      this.setState({ showComputerState: this.state.started ,hasData: true, data: data, playerWins, compuerWins, round: this.state.round + 1 });
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
    const { started, hasData, round, showComputerState } = this.state;
    const emoji = this.getEmoji(myMove);
    if (!started || !hasData) {
      // return <Intro started={started} startGame={e => this.setState({ started: true })} />
      return <GameView 
                key={`round-${round}`}
                startGame={e=>this.setState({started: true})}
                started={started}
                player={this.getEmoji(command)}
                ready={false} />
    }
    return <GameView key={`round-${round}`}
                     player={this.getEmoji(command)}
                     computer={this.getEmoji(myMove)}
                     whoWon={whoWon}
                     ready={showComputerState}
                     started={started}
                      />
  }

  getEmoji(myMove) {
    if (myMove === "rock") return ROCK;
    if (myMove === "paper") return PAPER;
    if (myMove === "scissors") return SCISSORS;
  }
}

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


