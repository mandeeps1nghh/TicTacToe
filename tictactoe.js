// tictactoe.js
import React, { useState, useCallback, useEffect } from 'react';
// At the top of the file, add this import
import './tictactoe.css';

// ... rest of your code remains unchanged ...

const SQUARES_COUNT = 9;

const Square = ({ value, onClick }) => {
  return (
    <button
      className="square"
      onClick={onClick}
      aria-label={`Square ${value}`}
    >
      {value}
    </button>
  );
};

const Board = ({ squares, onClick }) => {
  return (
    <div className="board">
      {squares.map((square, index) => (
        <button
          key={index}
          className={`board-cell ${square}`}
          onClick={() => handleClick(index)} // eslint-disable-line no-undef
          data-content={square}
          aria-label={`Square ${index + 1}`}
        />
      ))}
    </div>
  );
};

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const TicTacToe = () => {
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [player1Symbol, setPlayer1Symbol] = useState('X');
  const [startGame, setStartGame] = useState(false);
  const [squares, setSquares] = useState(Array(SQUARES_COUNT).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [isDraw, setIsDraw] = useState(false);

  const handlePlayer1NameChange = (e) => {
    setPlayer1Name(e.target.value.trim());
  };

  const handlePlayer2NameChange = (e) => {
    setPlayer2Name(e.target.value.trim());
  };

  const handlePlayer1SymbolChange = (e) => {
    setPlayer1Symbol(e.target.value);
  };

  const handleStartGame = (e) => {
    e.preventDefault();
    if (player1Name && player2Name) {
      setStartGame(true);
    }
  };

  const handleClick = useCallback((index) => {
    if (squares[index] || winner || isDraw) return;
    
    const newSquares = [...squares];
    const currentPlayerSymbol = xIsNext ? 'X' : 'O';
    newSquares[index] = currentPlayerSymbol;
    setSquares(newSquares);
    
    const newWinner = calculateWinner(newSquares);
    if (newWinner) {
      setWinner(newWinner);
      if (currentPlayerSymbol === player1Symbol) {
        setPlayer1Score((prevScore) => prevScore + 1);
      } else {
        setPlayer2Score((prevScore) => prevScore + 1);
      }
    } else if (newSquares.every(square => square !== null)) {
      setIsDraw(true);
    } else {
      setXIsNext(!xIsNext);
    }
  }, [squares, xIsNext, winner, isDraw, player1Symbol]);

  const handleReset = useCallback(() => {
    setSquares(Array(SQUARES_COUNT).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinner(null);
    setIsDraw(false);
  }, []);

  const handleNewGame = useCallback(() => {
    handleReset();
    setStartGame(false);
    setPlayer1Name('');
    setPlayer2Name('');
    setPlayer1Symbol('X');
    setPlayer1Score(0);
    setPlayer2Score(0);
  }, [handleReset]);

  useEffect(() => {
    if (startGame) {
      const winner = calculateWinner(squares);
      if (winner) {
        setWinner(winner);
        setGameOver(true);
      } else if (isBoardFull(squares)) {
        setGameOver(true);
      }
    }
  }, [squares, startGame]);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const isBoardFull = (squares) => {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        return false;
      }
    }

    return true;
  };

  const toggleSymbol = () => {
    setPlayer1Symbol(prevSymbol => prevSymbol === 'X' ? 'O' : 'X');
  };

  return (
    <div className="outer">
      {startGame ? (
        <div className="grid-container">
          <h1 className="game-title">Tic Tac Toe</h1>
          <div className="game-content">
            <div className="board">
              {squares.map((square, index) => (
                <button
                  key={index}
                  className={`board-cell ${square}`}
                  onClick={() => handleClick(index)}
                  data-content={square}
                  aria-label={`Square ${index + 1}`}
                />
              ))}
            </div>
            <div className="game-info">
              <div className="score-card">
                <h2>Score</h2>
                <p>{player1Name}: {player1Score}</p>
                <p>{player2Name}: {player2Score}</p>
              </div>
              {(winner || isDraw) && (
                <div className="game-result">
                  {winner ? `Winner: ${winner === player1Symbol ? player1Name : player2Name}` : 'Draw!'}
                </div>
              )}
              <div className="game-controls">
                <button className="reset-button" onClick={handleReset}>
                  <span>Reset</span>
                </button>
                <button className="new-game-button" onClick={handleNewGame}>
                  <span>New Game</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="prescreen">
          <h1 className="game-title">Tic Tac Toe</h1>
          <form>
            <div className="input-row">
              <div className="inputbox">
                <label htmlFor="player1Name">Player 1 Name</label>
                <input
                  id="player1Name"
                  type="text"
                  value={player1Name}
                  onChange={handlePlayer1NameChange}
                  placeholder="Enter name"
                />
              </div>
              <div className="inputbox">
                <label htmlFor="player2Name">Player 2 Name</label>
                <input
                  id="player2Name"
                  type="text"
                  value={player2Name}
                  onChange={handlePlayer2NameChange}
                  placeholder="Enter name"
                />
              </div>
            </div>
            <div className="spacer"></div>
            <div className="spacer"></div>
            <div className="input-row">
              <div className="toggle-container">
                <span className="toggle-label">Player 1 Symbol:</span>
                <button type="button" className="toggle-button" onClick={toggleSymbol}>
                  {player1Symbol}
                </button>
              </div>
            </div>
            <button className="button" onClick={handleStartGame} aria-label="Start game">
              <ArrowIcon />
              <span className="text">Start</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
