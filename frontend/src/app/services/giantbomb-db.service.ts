import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable( {
  providedIn: 'root'
} )
export class GiantbombDbService {
  private giantBombURL: String = "https://www.giantbomb.com/api/"
  private apiKey: String = "53a931fb4f5b5e21e58d648276d55f1378019f5f"

  constructor( private http: HttpClient ) { }

  //Return data of a specific game
  fetchGameData( guid: String ): Observable<any> {
    return this.http.get<any>( `${ this.giantBombURL }/game/${ guid }/?api_key=${ this.apiKey }&format=json` )
  }

  //Return a json contianing games
  fetchGames(): Observable<any> {
    return this.http.get<any>( `${ this.giantBombURL }/games/?api_key=${ this.apiKey }&format=json` )
  }
}


