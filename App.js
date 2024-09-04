// App.js
import React from 'react';
import TicTacToe from './tictactoe';
import  './App.css'; 

console.log(TicTacToe); // Add this line to see if TicTacToe is being imported correctly

const App = () => {
  return (
    <div className="App">
      <TicTacToe />
    </div>
  );
};

export default App;