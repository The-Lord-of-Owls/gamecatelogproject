import { Component } from '@angular/core';
import { GiantbombDbService } from '../services/giantbomb-db.service';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-info',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.scss'
})
export class GameInfoComponent {

  guid?: string;
  game?: any;

  constructor(private giantBombService: GiantbombDbService, private route: ActivatedRoute) { }

  fetchGame(guid: string) {
    this.giantBombService.fetchGameData(guid).subscribe((game) => {
      console.log(game.results);
      this.game = game.results
      this.game.devs = game.results.developers.map((dev: any) => dev.name);
      this.game.genre = game.results.genres.map((genre: any) => genre.name);
    })
  }

  ngOnInit() {
    this.route.url.subscribe((event) => {
      this.guid = event[1].path;
      this.fetchGame(this.guid);
    })
  }

}
