import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-all-games',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatCardModule
  ],
  templateUrl: './all-games.component.html',
  styleUrl: './all-games.component.scss'
})
export class AllGamesComponent {

  games: any[] = new Array(100);
  pageSize: number = 10;

}
