import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GiantbombDbService {
  private giantBombURL: string = "https://www.giantbomb.com/api"
  private apiKey: string = "53a931fb4f5b5e21e58d648276d55f1378019f5f"

  constructor(private http: HttpClient) { }

  //Return data of a specific game
  fetchGameData(guid: string): Observable<any> {
    let baseHeaders = new HttpHeaders();
    let baseParams = new HttpParams();

    baseHeaders = baseHeaders.set('Access-Control-Allow-Origin', '*');
    baseHeaders = baseHeaders.set('Content-Type', 'application/json');

    baseParams = baseParams.set('api_key', this.apiKey)
    baseParams = baseParams.set('format', 'json');

    return this.http.get<any>(`${this.giantBombURL}/game/${guid}`, {
      headers: baseHeaders,
      params: baseParams
    })
  }

  //Return a json contianing games
  fetchGames(limit: number, offset: number): Observable<any> {
    let baseHeaders = new HttpHeaders();
    let baseParams = new HttpParams();

    baseHeaders = baseHeaders.set('Access-Control-Allow-Origin', '*');
    baseHeaders = baseHeaders.set('Content-Type', 'application/json');

    baseParams = baseParams.set('api_key', this.apiKey)
    baseParams = baseParams.set('format', 'json');
    baseParams = baseParams.set('limit', limit);
    baseParams = baseParams.set('offset', offset);

    return this.http.get<any>(`${this.giantBombURL}/games`, {
      headers: baseHeaders,
      params: baseParams
    })
  }
}


