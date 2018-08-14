import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';

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
      this.setState({ data: data, playerWins, compuerWins, round: this.state.round + 1 });
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
    const { round, playerWins, compuerWins } = this.state;
    const emoji = this.getEmoji(myMove);
    if (!myMove) {
      return <div style={{ margin: "30px" }}>
        <h1>Rock Paper Scissors</h1>
        <h2>Watting for your move!</h2>
        <img alt="Roni & Uri" src="https://pbs.twimg.com/media/DiUAnW1WAAA2PAk.jpg" width="300px" />
        <h2>Commands (dev)</h2>
        <ul>
          <GameLink host={DEV_SERVER} move="rock" />
          <GameLink host={DEV_SERVER} move="paper" />
          <GameLink host={DEV_SERVER} move="scissors" />
        </ul>
        <h2>Commands (production)</h2>
        <ul>
          <GameLink host={PROD_SERVER} move="rock" />
          <GameLink host={PROD_SERVER} move="paper" />
          <GameLink host={PROD_SERVER} move="scissors" />
        </ul>
      </div>
    }
    return (
      <div style={{ textAlign: "center" }}>
        <div>Round: {round}</div>
        <div key={round} className="scale" style={{ fontSize: "260px" }}>{emoji}</div>
        <div>You played: {this.getEmoji(command)} </div>
        <Winner whoWon={whoWon} />
        <TotalScore playerWins={playerWins} compuerWins={compuerWins} />
        <Commands onClick={(command)=>this.play(command)}/>
      </div>
    );
  }

  getEmoji(myMove) {
    if (myMove === "rock") return ROCK;
    if (myMove === "paper") return PAPER;
    if (myMove === "scissors") return SCISSORS;
  }
}

const TotalScore = ({ playerWins, compuerWins }) =>
  <div>
    <div>{`Your score: ${playerWins}`}</div>
    <div>{`My score: ${compuerWins}`}</div>
  </div>

const Winner = ({ whoWon }) => {
  if (whoWon === "player") {
    return <h1 style={{ color: "green" }}>You Win!</h1>
  } else if (whoWon === "computer") {
    return <h1 style={{ color: "red" }}>I Win!</h1>
  }
  return <h1 style={{ color: "black" }}>No Winner</h1>
}


const GameLink = ({ host, move }) => {
  const url = `${host}/play/${move}`
  return (
    <li>
      <a href={url} target={move}>{`curl '${url}'`}</a>
    </li>
  )
}

const Commands = ({onClick})=> 
  <div>
    <span style={{fontSize:48, marginRight: "20px", cursor: "pointer"}} onClick={e=>onClick('rock')}>{ROCK}</span>
    <span style={{fontSize:48, marginRight: "20px", cursor: "pointer"}} onClick={e=>onClick('paper')}>{PAPER}</span>
    <span style={{fontSize:48, marginRight: "20px", cursor: "pointer"}} onClick={e=>onClick('scissors')}>{SCISSORS}</span>
  </div>

export default App;


