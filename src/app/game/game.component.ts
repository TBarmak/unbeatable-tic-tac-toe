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

  makeBotMove(mark) {
    let bestScore = -1
    let candidateMoves = []
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        let outcome = this.evaluateMove(this.board, r, c, mark, true)
        if (outcome !== null && outcome === bestScore) {
          candidateMoves.push([r, c])
        } else if (outcome !== null && outcome > bestScore) {
          bestScore = outcome
          candidateMoves = [[r, c]]
        }
      }
    }
    let move = candidateMoves[Math.floor(Math.random() * candidateMoves.length)]
    this.move(move[0], move[1])
  }

  /*

  */
  evaluateMove(board, row, column, mark, botMove) {
    let boardCopy = JSON.parse(JSON.stringify(board))

    // If the move is illegal, return null
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

    if (winPresent) {
      if (botMove) {
        return 1
      } else {
        return -1
      }
    }
    let scores = []
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        let outcome = this.evaluateMove(boardCopy, r, c, mark === 1 ? 4 : 1, !botMove)
        if (outcome !== null) {
          scores.push(outcome)
        }
      }
    }
    if (scores.length === 0) {
      return 0
    }
    return botMove ? Math.min(...scores) : Math.max(...scores)
  }

  checkGameOver(row, column) {
    let rowSum = this.board[row].reduce((a, b) => a + b, 0)
    if (rowSum === 3 || rowSum === 12) {
      this.gameOver = true;
      return row
    }
    let colSum = this.board.map((val) => val[column]).reduce((a, b) => a + b, 0)
    if (colSum === 3 || colSum === 12) {
      this.gameOver = true;
      return column + 3
    }
    let diag1Sum = this.board.map((val, index) => val[index]).reduce((a, b) => a + b, 0)
    if (diag1Sum === 3 || diag1Sum === 12) {
      this.gameOver = true;
      return 7
    }
    let diag2Sum = this.board.map((val, index) => val[2 - index]).reduce((a, b) => a + b, 0)
    if (diag2Sum === 3 || diag2Sum === 12) {
      this.gameOver = true;
      return 8
    }
    if (this.moves >= 9) {
      this.gameOver = true;
    }
    return null
  }

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

  getCanvasDimensions() {
    let canvas = <HTMLCanvasElement>document.getElementById("canvas")
    let rect = canvas.getBoundingClientRect()
    this.canvasHeight = rect['height']
    this.canvasWidth = rect['width']
  }

  drawLine(direction) {
    let canvas = <HTMLCanvasElement>document.getElementById("canvas")
    let ctx = canvas.getContext('2d');

    if (direction < 3) {
      ctx.moveTo(0, (this.canvasHeight * (2 * direction + 1)) / 6)
      ctx.lineTo(this.canvasWidth, (this.canvasHeight * (2 * direction + 1)) / 6)
    }
    else if (direction < 6) {
      ctx.moveTo((this.canvasWidth * (2 * (direction - 3) + 1)) / 6, 0)
      ctx.lineTo((this.canvasWidth * (2 * (direction - 3) + 1)) / 6, this.canvasHeight)
    } else if (direction === 6) {
      ctx.moveTo(this.canvasWidth, 0)
      ctx.lineTo(0, this.canvasHeight)
    } else if (direction === 7) {
      ctx.moveTo(0, 0)
      ctx.lineTo(this.canvasWidth, this.canvasHeight)
    }
    ctx.strokeStyle = "#248232"
    ctx.lineWidth = 1
    ctx.stroke()
  }

  ngOnInit(): void {
    this.getCanvasDimensions()
  }
}
