import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { GiantbombDbService } from '../services/giantbomb-db.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-games',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './all-games.component.html',
  styleUrl: './all-games.component.scss'
})
export class AllGamesComponent {

  length = 50;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  pageEvent?: PageEvent;
  games: any[] = [];

  constructor( private giantBombService: GiantbombDbService ) { }

  fetchGamesList(pageSize: number, pageIndex: number) {
    this.giantBombService.fetchGames(pageSize, (pageSize * pageIndex)).subscribe((games) => {
      this.games = games.results;
      this.length = games.number_of_total_results;
      console.log(games.results);
    })
  }

  ngOnInit() {
    this.fetchGamesList(this.pageSize, this.pageIndex);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.fetchGamesList(this.pageSize, this.pageIndex);
  }

}
