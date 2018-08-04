import React, { Component } from 'react';
import io from 'socket.io-client';
import logo from './logo.svg';
import './App.css';

const PAPER = "✋";
const ROCK = "👊";
const SCISSORS = "✌️";
class App extends Component {
  state = {
    round: 0,
    data: {},
  };

  componentDidMount() {
    if (process.env.NODE_ENV == "production") {
      this.socket = io();
    } else {
      this.socket = io("http://localhost:5000");
    }
    this.socket.on("play", (data) => {
      console.log('got data', data)
      this.setState({data: data, round: this.state.round+1 });
    })
    //to keep the connection alive in heroku env
    setInterval(()=> this.socket.send('keepAlive',{t: Date.now()}, (msg)=>console.log(msg)), 25 * 1000);
  }

  render() {
    const {myMove, whoWon, command} = this.state.data;
    const emoji = this.getEmoji(myMove);
    if (!myMove) {
      return <div>
        <h1>Watting for your move!</h1>
        <h2>Commands (dev)</h2>
        <ul>
          <li>http://localhost:5000/play/rock</li>
          <li>http://localhost:5000/play/paper</li>
          <li>http://localhost:5000/play/scissors</li>
        </ul>
        <h2>Commands (production)</h2>
        <ul>
          <li>/play/rock</li>
          <li>/play/paper</li>
          <li>/play/scissors</li>
        </ul>
      </div>
    }
    return (
      <div>
        <div>Round: {this.state.round}</div>
        <div style={{fontSize: "260px"}}>{emoji}</div>
        <div>You played: {command} </div>
        <h1>{whoWon} WON!</h1>
      </div>
    );
  }

  getEmoji(myMove) {
    if (myMove == "rock") return ROCK;
    if (myMove == "paper") return PAPER;
    if (myMove == "scissors") return SCISSORS;
  }
}

export default App;