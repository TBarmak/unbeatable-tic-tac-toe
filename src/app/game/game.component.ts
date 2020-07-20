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

  constructor() { }

  checkGameOver(row, column) {
    let rowSum = this.board[row].reduce((a, b) => a + b, 0)
    if(rowSum === 3 || rowSum === 12) {
      this.gameOver = true;
      return row
    }
    let colSum = this.board.map((val) => val[column]).reduce((a, b) => a + b, 0)
    if(colSum === 3 || colSum === 12) {
      this.gameOver = true;
      return column + 3
    }
    let diag1Sum = this.board.map((val, index) => val[index]).reduce((a, b) => a + b, 0)
    if(diag1Sum === 3 || diag1Sum === 12) {
      this.gameOver = true;
      return 7
    }
    let diag2Sum = this.board.map((val, index) => val[2 - index]).reduce((a, b) => a + b, 0)
    if(diag2Sum === 3 || diag2Sum === 12) {
      this.gameOver = true;
      return 8
    }
    if(this.moves >= 9) {
      this.gameOver = true;
    }
    return null
  }

  move(row, column) {
    if(!this.gameOver && this.board[row][column] === 0) {
      if(this.turn) {
        this.board[row][column] = 4;
        this.turn = !this.turn;
        this.moves += 1
      } else {
        this.board[row][column] = 1;
        this.turn = !this.turn;
        this.moves += 1
      }
      let win = this.checkGameOver(row, column)
      if(win !== null) {
        
      }
    }
  }

  ngOnInit(): void {
  }

}
