import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-games',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatCardModule
  ],
  templateUrl: './user-games.component.html',
  styleUrl: './user-games.component.scss'
})
export class UserGamesComponent {

  games: any[] = new Array(100);
  pageSize: number = 10;

}
