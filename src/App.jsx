import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import './styles/App.css';
import { calculateWinner } from './utils/gameLogic';

// Minimax algorithm for the bot
function minimax(squares, isMaximizing) {
  const winner = calculateWinner(squares);
  if (winner === 'O') return { score: 1 };
  if (winner === 'X') return { score: -1 };
  if (!squares.includes(null)) return { score: 0 };

  let bestMove;
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const newSquares = squares.slice();
        newSquares[i] = 'O';
        const { score } = minimax(newSquares, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        const newSquares = squares.slice();
        newSquares[i] = 'X';
        const { score } = minimax(newSquares, true);
        if (score < bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return { score: bestScore, move: bestMove };
  }
}

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [mode, setMode] = useState('bot'); // 'bot' or 'pvp'
  const winner = calculateWinner(squares);

  // Bot move effect (only in bot mode)
  useEffect(() => {
    if (mode === 'bot' && !xIsNext && !winner) {
      const { move } = minimax(squares, true);
      if (move !== undefined) {
        const newSquares = squares.slice();
        newSquares[move] = 'O';
        setTimeout(() => {
          setSquares(newSquares);
          setXIsNext(true);
        }, 500);
      }
    }
  }, [xIsNext, squares, winner, mode]);

  const handleClick = (index) => {
    if (squares[index] || winner) return;
    if (mode === 'bot') {
      if (!xIsNext) return; // Only allow player move when it's player's turn
      const newSquares = squares.slice();
      newSquares[index] = 'X';
      setSquares(newSquares);
      setXIsNext(false);
    } else {
      const newSquares = squares.slice();
      newSquares[index] = xIsNext ? 'X' : 'O';
      setSquares(newSquares);
      setXIsNext(!xIsNext);
    }
  };

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
    handleReset();
  };

  return (
    <div className="game">
      <h1>Tic-Tac-Toe: {mode === 'bot' ? 'You (X) vs Bot (O)' : 'Player vs Player'}</h1>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input
            type="radio"
            value="bot"
            checked={mode === 'bot'}
            onChange={handleModeChange}
            style={{ marginRight: 8 }}
          />
          Play vs Bot
        </label>
        <label style={{ marginLeft: 16 }}>
          <input
            type="radio"
            value="pvp"
            checked={mode === 'pvp'}
            onChange={handleModeChange}
            style={{ marginRight: 8 }}
          />
          Play vs Player
        </label>
      </div>
      <Board squares={squares} onClick={handleClick} />
      {winner
        ? <p className="winner">Winner: {winner}</p>
        : squares.includes(null)
          ? <p>Next player: {xIsNext ? 'X' : 'O'}</p>
          : <p>Draw!</p>
      }
      <button onClick={handleReset}>Reset Game</button>
    </div>
  );
}

export default App;