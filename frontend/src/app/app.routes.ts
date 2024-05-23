import { Routes } from '@angular/router';
import { AllGamesComponent } from './all-games/all-games.component';
import { UserGamesComponent } from './user-games/user-games.component';
import { LoginComponent } from './login/login.component';
import { GameInfoComponent } from './game-info/game-info.component';

export const routes: Routes = [
    {
        path: '',
        component: AllGamesComponent
    },
    {
        path: 'my-games',
        component: UserGamesComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'game/:name',
        component: GameInfoComponent
    }
];
