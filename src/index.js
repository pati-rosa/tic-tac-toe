import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function Board(props) {
  function generateLines(squares) {
    let lines = []

    for (let i = 0; i < 9; i = i + 3) {
      const lineSquares = squares.slice(i, i + 3)

      lines.push(lineSquares)
    }

    return lines
  }

  return (
    <div>
      {generateLines(props.squares).map((line, lineIndex) => <div className="board-row" key={`line-${lineIndex + 1}`}>
        {line.map((square, squareIndex) => <Square
          value={square}
          onClick={() => props.onClick(squareIndex + 3 * lineIndex)}
          key={`square-${squareIndex + 3 * lineIndex}`}
        />)}
      </div>)}
      {/* <div className="board-row">
        {props.squares.map((square, index)=> <Square key={index} value={square} />)}
        <Square 
          value={props.squares[0]} 
          onClick={()=>props.onClick(0)}
        />
        <Square 
          value={props.squares[1]} 
          onClick={()=>props.onClick(1)}
        />
        <Square 
          value={props.squares[2]} 
          onClick={()=>props.onClick(2)}
        />           
      </div>
      <div className="board-row">
        <Square 
            value={props.squares[3]} 
            onClick={()=>props.onClick(3)}
          />
        <Square 
          value={props.squares[4]} 
          onClick={()=>props.onClick(4)}
        />
        <Square 
          value={props.squares[5]} 
          onClick={()=>props.onClick(5)}
        />
      </div>
      <div className="board-row">
        <Square 
          value={props.squares[6]} 
          onClick={()=>props.onClick(6)}
        />
        <Square 
          value={props.squares[7]} 
          onClick={()=>props.onClick(7)}
        />
        <Square 
          value={props.squares[8]} 
          onClick={()=>props.onClick(8)}
        />
      </div> */}
    </div>
  );

}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {

      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            stepNumber={this.state.stepNumber}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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
}
