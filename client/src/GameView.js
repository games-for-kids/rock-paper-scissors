import React, { Component } from 'react';
import './GameView.css';


export default ({player, computer, whoWon})=>
  <div style={{display:'inline-block', width:'100%'}}>
    <Col title="HBP-9000" color="red" bgColor='rgba(255,0,0,0.05)' command={computer} />
    <Col title="You" color="blue" bgColor='rgba(0,0,255,0.05)' command={player} />
    <div className="result-text">
      <Result whoWon={whoWon} />
    </div>
  </div>

const Col = ({title, color, bgColor, command})=>
  <div className="col" style={{border: `4px solid ${color}`, backgroundColor: bgColor}}>
    <h1 style={{textAlign: 'center'}}>{title}</h1>
    <div className="command">{command}</div>
  </div>

const Result = ({whoWon}) => {
  console.log("whoWon", whoWon)
  if (whoWon == "player") {
    return <span style={{color: '#8dff8d'}}>You Win!</span>
  } 
  if (whoWon == "computer") {
    return <span style={{color: '#8d0d0d'}}>HBP-9000 Wins!</span>
  }
  if (whoWon == "tie") {
    return <span>Tie!</span>
  }
  return "";
}
