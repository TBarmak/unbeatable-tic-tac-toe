import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @Output() resetEmitter = new EventEmitter();
  @Output() orderEmitter = new EventEmitter();
  @Output() gameTypeEmitter = new EventEmitter();

  playBot: boolean = true
  botFirst: boolean = false

  resetGame() {
    this.resetEmitter.emit(true)
  }

  togglePlayBot() {
    this.gameTypeEmitter.emit(!this.playBot)
    this.playBot = !this.playBot
  }

  toggleBotFirst() {
    this.orderEmitter.emit(!this.botFirst)
    this.botFirst = !this.botFirst
  }

  constructor() { }

  ngOnInit(): void {
  }

}
