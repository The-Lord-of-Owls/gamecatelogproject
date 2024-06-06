import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable( {
	providedIn: 'root'
} )
export class GiantbombDbService {
	private giantBombURL: string = "http://localhost:8080"
	private baseHeaders = new HttpHeaders()

	constructor( private http: HttpClient ) {
		this.baseHeaders = this.baseHeaders.set( 'Access-Control-Allow-Origin', '*' )
		this.baseHeaders = this.baseHeaders.set( 'Content-Type', 'application/json' )
	}

	//Return data of a specific game
	fetchGameData( guid: string ): Observable<any> {
		return this.http.get<any>( `${ this.giantBombURL }/game/${ guid }`, {
			headers: this.baseHeaders
		} )
	}

	//Return a json contianing games
	fetchGames( limit: number, offset: number ): Observable<any> {
		return this.http.get<any>( `${ this.giantBombURL }/games/${ limit }&${ offset }`, {
			headers: this.baseHeaders
		} )
	}
}


