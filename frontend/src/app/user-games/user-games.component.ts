import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-user-games',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatCardModule,
    RouterLink,
  ],
  templateUrl: './user-games.component.html',
  styleUrl: './user-games.component.scss'
})
export class UserGamesComponent {

  length = 50;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [10, 25, 50, 100];
  pageEvent?: PageEvent;
  games: any[] = [];

  constructor( private userService: BackendService ) { }

  fetchGamesList(pageSize: number, pageIndex: number) {
    this.userService.fetchMyGames().subscribe((games) => {
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
