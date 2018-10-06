import React, { Component } from 'react';
import './GameView.css';
import IntroImage from './assets/intro.jpg';

const IntroBackgroundColor = '#cb8a51';

export default ({ player, computer, whoWon, ready, startGame, started }) =>
  <div style={{ display: 'inline-block', width: '100%' }}>
    {ready && <Col title="HBP-9000" color="red" bgColor='rgba(255,0,0,0.05)' command={computer} />}
    {!ready && <Intro startGame={startGame} started={started} />}
    <Col title="You" color="blue" bgColor='rgba(0,0,255,0.05)' command={player} />
    {ready &&
      <div className="result-text">
        <Result whoWon={whoWon} />
      </div>}

  </div>

const Col = ({ title, color, bgColor, command }) =>
  <div className="col" style={{ border: `4px solid ${color}`, backgroundColor: bgColor }}>
    <h1 style={{ textAlign: 'center' }}>{title}</h1>
    <div className="command scale">{command}</div>
  </div>

const Result = ({ whoWon }) => {
  console.log("whoWon", whoWon)
  if (whoWon == "player") {
    return <span style={{ color: '#8dff8d' }}>You Win!</span>
  }
  if (whoWon == "computer") {
    return <span style={{ color: '#8d0d0d' }}>HBP-9000 Wins!</span>
  }
  if (whoWon == "tie") {
    return <span>Tie!</span>
  }
  return "";
}



const Intro = ({ startGame, started }) =>
  <div style={{ width: "50%",
                display:'inline-block',
                border: '4px solid red',
                boxSizing: 'border-box',
                verticalAlign:'top',
                height:'550px' }}>
                <img src={IntroImage} width="100%"/>
  
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
  </div>
