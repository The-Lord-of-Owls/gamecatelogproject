import { Component } from '@angular/core';
import { GiantbombDbService } from '../services/giantbomb-db.service';

@Component({
  selector: 'app-game-info',
  standalone: true,
  imports: [],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.scss'
})
export class GameInfoComponent {

  guid = '3030-1';

  constructor( private giantBombService: GiantbombDbService ) { }

  fetchGame(guid: string) {
    this.giantBombService.fetchGameData(guid).subscribe((game) => {
      console.log(game)
    })
  }

  ngOnInit() {
    this.fetchGame(this.guid);
  }

}
