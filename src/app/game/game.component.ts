import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  turn: boolean = true
  gameOver: boolean = false
  moves: number = 0
  board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]
  rowIndices = [0, 1, 2]
  colIndices = [0, 1, 2]
  canvasWidth = 0
  canvasHeight = 0
  blocked = false

  constructor() { }

  /*
  makeBotMove(mark) determines the best move to make and makes it
  mark - a number indicating to make the move as 'X' (4) or 'O' (1)
  */
  makeBotMove(mark) {
    // Assume that the best available move results in the bot losing.
    let bestScore = -1
    let candidateMoves = []

    // Go through every possible move and evaluate it.
    // A move takes takes the form [row, column]
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        let outcome = this.evaluateMove(this.board, r, c, mark, true)
        // If the move is equally as good as the best score, add it to the list of candidate moves.
        if (outcome !== null && outcome === bestScore) {
          candidateMoves.push([r, c])
        }
        // If the move is better than the best score, update the best score and set the candidate moves
        // to only contain that move.
        else if (outcome !== null && outcome > bestScore) {
          bestScore = outcome
          candidateMoves = [[r, c]]
        }
      }
    }
    if (candidateMoves.length === 0) {
      return
    }

    // Randomly select a move from the list of candidate moves and play it
    let move = candidateMoves[Math.floor(Math.random() * candidateMoves.length)]
    this.move(move[0], move[1])
  }

  /*
  evaluateMove(board, row, column, mark, botMove) recursively scores a move using the minimax algorithm. Moves that
  result in a guaranteed bot win are scored with 1, while moves where the opponent has the opportunity to win are
  scored with a -1. Moves where neither player has a guaranteed win are scored with 0. Illegal moves are scored with null.
  board - a list of lists of numbers representing the tic-tac-toe board where 4 = 'X', 1 = 'O' and 0 = empty
  row - a number (0 - 2, inclusive) representing the row to make the move in
  column - a number (0 - 2, inclusive) representing the column to make the move in
  mark - a number (1 or 4) representing if the move is being made for X (4) or O (1)
  botMove - a boolean that is true if this move is for the bot and false otherwise
  */
  evaluateMove(board, row, column, mark, botMove) {
    let boardCopy = JSON.parse(JSON.stringify(board))

    // If the move is illegal, return null.
    if (boardCopy[row][column] !== 0) {
      return null
    }

    boardCopy[row][column] = mark
    let winPresent = false

    // Check for a row win
    let rowSum = boardCopy[row].reduce((a, b) => a + b, 0)
    if (rowSum === 3 * mark) {
      winPresent = true
    }
    // Check for a column win
    let colSum = boardCopy.map((val) => val[column]).reduce((a, b) => a + b, 0)
    if (colSum === 3 * mark) {
      winPresent = true
    }
    // Check for diagonal wins
    let diag1Sum = boardCopy.map((val, index) => val[index]).reduce((a, b) => a + b, 0)
    if (diag1Sum === 3 * mark) {
      winPresent = true
    }
    let diag2Sum = boardCopy.map((val, index) => val[2 - index]).reduce((a, b) => a + b, 0)
    if (diag2Sum === 3 * mark) {
      winPresent = true
    }

    // If the move results in a win, return 1 if the bot made the move and -1 if the user is hypothetically making the move.
    if (winPresent) {
      if (botMove) {
        return 1
      } else {
        return -1
      }
    }

    // If there is not a winner, get the score of all possible future moves.
    let scores = []
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        let outcome = this.evaluateMove(boardCopy, r, c, mark === 1 ? 4 : 1, !botMove)
        if (outcome !== null) {
          scores.push(outcome)
        }
      }
    }

    // If the game is over (no possible moves), return 0 for a tie.
    if (scores.length === 0) {
      return 0
    }

    // If the bot is making the move, the score of the move is the minimum of the future moves.
    // If the player is making the move, the score is the maximum of the future moves.
    return botMove ? Math.min(...scores) : Math.max(...scores)
  }

  /*
  checkGameOver(row, column) checks if the marking made at position (row, column) has resulted in a win or
  if the board is full (9 moves have been made). If the game has been won, it returns a number indicating
  where the win occured. 0-2, inclusive, are the rows. 3-5 inclusive are the columns, and 6 and 7 represent
  the two diagonals.
  row - a number representing the index of the row where the marking was made
  column - a number representing the index of the column where the marking was made
  */
  checkGameOver(row, column) {
    // Check for row win
    let rowSum = this.board[row].reduce((a, b) => a + b, 0)
    if (rowSum === 3 || rowSum === 12) {
      this.gameOver = true;
      return row
    }
    // Check for column win
    let colSum = this.board.map((val) => val[column]).reduce((a, b) => a + b, 0)
    if (colSum === 3 || colSum === 12) {
      this.gameOver = true;
      return column + 3
    }
    // Check for declining diagonal win
    let diag1Sum = this.board.map((val, index) => val[index]).reduce((a, b) => a + b, 0)
    if (diag1Sum === 3 || diag1Sum === 12) {
      this.gameOver = true;
      return 6
    }
    // Check for inclining diagonal win
    let diag2Sum = this.board.map((val, index) => val[2 - index]).reduce((a, b) => a + b, 0)
    if (diag2Sum === 3 || diag2Sum === 12) {
      this.gameOver = true;
      return 7
    }
    // If 9 moves have been made, the game is over.
    if (this.moves >= 9) {
      this.gameOver = true;
    }
    return null
  }

  /*
  move(row, column) makes a marking in the specified row and column. The marking is determined by this.turn.
  row - a number (0 - 2, inclusive) representing the index of the row to place the marking in
  column - a number (0 - 2, inclusive) representing the index of the column to place the marking in
  */
  move(row, column) {
    if (!this.gameOver && this.board[row][column] === 0) {
      if (this.turn) {
        this.board[row][column] = 4;
        this.turn = !this.turn;
        this.moves += 1
        this.blocked = true
        setTimeout(() => {
          this.makeBotMove(1)
          this.blocked = false
        }, 1000)
      } else {
        this.board[row][column] = 1;
        this.turn = !this.turn;
        this.moves += 1
      }
      let win = this.checkGameOver(row, column)
      if (win !== null) {
        this.drawLine(win)
      }
    }
  }

  /*
  getCanvasDimensions() gets the dimensions of the canvas for drawing the line to show where a player won
  */
  getCanvasDimensions() {
    let canvas = <HTMLCanvasElement>document.getElementById("canvas")
    let rect = canvas.getBoundingClientRect()
    this.canvasHeight = rect['height']
    this.canvasWidth = rect['width']
  }

  /*
  drawLine(direction) will draw a line to show how a player won based on the specified direction
  direction - a number 0 - 7, inclusive, indicating where the win is on the board (0 - 2, inclusive = rows,
        3 - 5, inclusive = columns, 6 & 7 = diagonals)
  */
  drawLine(direction) {
    let canvas = <HTMLCanvasElement>document.getElementById("canvas")
    let ctx = canvas.getContext('2d');

    if (direction < 3) {
      ctx.moveTo(0, (this.canvasHeight * (2 * direction + 1)) / 6)
      ctx.lineTo(this.canvasWidth, (this.canvasHeight * (2 * direction + 1)) / 6)
    } else if (direction < 6) {
      ctx.moveTo((this.canvasWidth * (2 * (direction - 3) + 1)) / 6, 0)
      ctx.lineTo((this.canvasWidth * (2 * (direction - 3) + 1)) / 6, this.canvasHeight)
    } else if (direction === 6) {
      ctx.moveTo(0, 0)
      ctx.lineTo(this.canvasWidth, this.canvasHeight)
    } else if (direction === 7) {
      ctx.moveTo(this.canvasWidth, 0)
      ctx.lineTo(0, this.canvasHeight)
    }
    ctx.strokeStyle = "#248232"
    ctx.lineWidth = 1
    ctx.stroke()
  }

  ngOnInit(): void {
    this.getCanvasDimensions()
  }
}
