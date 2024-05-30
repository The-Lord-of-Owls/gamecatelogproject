import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

//Interfaces for the backend
export interface LoginData {
	email: string
	password: string
}
export interface LogoutData {
	email: string
}
export interface RegistationData {
	name: string
	email: string
	password: string
	passwordConfirmation: string
}

@Injectable( {
  providedIn: 'root'
} )
export class BackendService {
  private backendURL: string = "http://localhost:8080"

  private baseHeaders = new HttpHeaders();

  constructor( private http: HttpClient ) {
	this.baseHeaders = this.baseHeaders.set('Access-Control-Allow-Origin', '*');
	this.baseHeaders = this.baseHeaders.set('Content-Type', 'application/json');
  }

  //This is bad, don't do this. Angular forced my hand with it's stupid HttpClient not wanting to work with post,
  //Why on earth can't we just use fetch without problems? It's litterally built into every browser on eart.
  //TODO: Rework to send passwords through normal http.post instead of through get as query parameters
  login( data: LoginData ): Observable<any> {
	let baseParams = new HttpParams();

	baseParams = baseParams.set( "email", data.email )
	baseParams = baseParams.set( "password", data.password )

	return this.http.post( `${ this.backendURL }/login`, data, {
		headers: this.baseHeaders,
		params: baseParams
	} )
  }

  logout( data: LogoutData ): Observable<any> {
	let baseParams = new HttpParams();

	baseParams = baseParams.set( "email", data.email )

	return this.http.post( `${ this.backendURL }/logout`, data, {
		headers: this.baseHeaders,
		params: baseParams
	} )
  }

  register( data: RegistationData ): Observable<any> {
	let baseParams = new HttpParams();

	baseParams = baseParams.set( "name", data.name )
	baseParams = baseParams.set( "email", data.email )
	baseParams = baseParams.set( "password", data.password )
	baseParams = baseParams.set( "passwordConfirmation", data.passwordConfirmation )

	return this.http.post( `${ this.backendURL }/register`, data, {
		headers: this.baseHeaders,
		params: baseParams
	} )
  }

  //Return an array of user's games that they favorited
  fetchMyGames(): Observable<any> {
    return this.http.get<any>( `${ this.backendURL }/my-game` )
  }

  addToMyGames( guid: string ): Observable<any> {
	let baseParams = new HttpParams();

	baseParams = baseParams.set( "guid", guid )

	return this.http.post<any>( `${ this.backendURL }/my-game/add`, guid, {
		headers: this.baseHeaders,
		params: baseParams
	} )
  }

  removeFromMyGames( guid: string ): Observable<any> {
	let baseParams = new HttpParams();

	baseParams = baseParams.set( "guid", guid )

	return this.http.post<any>( `${ this.backendURL }/my-game/remove`, guid, {
		headers: this.baseHeaders,
		params: baseParams
	} )
  }

  //Return info about the currently logged in user
  fetchUserInfo(): Observable<any> {
    return this.http.get<any>( `${ this.backendURL }/user-info` )
  }
}


