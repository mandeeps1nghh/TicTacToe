// tictactoe.js
import React, { useState, useEffect, useCallback } from 'react';

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
        <Square key={index} value={square} onClick={() => onClick(index)} />
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

  const handleClick = useCallback(
    (i) => {
      if (gameOver || squares[i] !== null) {
        return;
      }

      const newSquares = [...squares];
      newSquares[i] = xIsNext ? player1Symbol : (player1Symbol === 'X' ? 'O' : 'X');
      setSquares(newSquares);
      setXIsNext(!xIsNext);
    },
    [gameOver, squares, xIsNext, player1Symbol]
  );

  const handleReset = useCallback(() => {
    setSquares(Array(SQUARES_COUNT).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinner(null);
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
        if (winner === 'X') {
          setPlayer1Score((prevScore) => prevScore + 1);
        } else {
          setPlayer2Score((prevScore) => prevScore + 1);
        }
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
        <>
          <div className="card">
            <div className="jumbotron text-center">
              <h1>Tic Tac Toe</h1>
            </div>
            <div className="board">
              <Board squares={squares} onClick={handleClick} />
            </div>
            {gameOver && (
              <div className="text-center mt-4">
                {winner ? (
                  <p>
                    Player {winner === 'X' ? player1Name : player2Name} wins!
                  </p>
                ) : (
                  <p>
                    It's a draw!
                  </p>
                )}
                <button className="button" onClick={handleReset} aria-label="Reset game">
                  <ArrowIcon />
                  <span className="text">Reset</span>
                </button>
                <button className="button" onClick={handleNewGame} aria-label="New game">
                  <ArrowIcon />
                  <span className="text">New Game</span>
                </button>
              </div>
            )}
          </div>
          <div className="score-card">
            <h2>Score</h2>
            <p>{player1Name}: {player1Score}</p>
            <p>{player2Name}: {player2Score}</p>
          </div>
        </>
      ) : (
        <div className="prescreen">
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