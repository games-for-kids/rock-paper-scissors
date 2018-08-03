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
    this.socket = io("http://localhost:5000");
    this.socket.on("play", (data) => {
      console.log('got data', data)
      this.setState({data: data, round: this.state.round+1 });
    })
  }

  render() {
    const {myMove, whoWon, command} = this.state.data;
    const emoji = this.getEmoji(myMove);
    if (!myMove) {
      return <h1>Watting for your move!</h1>
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