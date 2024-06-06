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

  login( data: LoginData ): Observable<any> {
	return this.http.post( `${ this.backendURL }/login`, data, {
		headers: this.baseHeaders,
	} )
  }

  logout( data: LogoutData ): Observable<any> {

	return this.http.post( `${ this.backendURL }/logout`, data, {
		headers: this.baseHeaders,
	} )
  }

  register( data: RegistationData ): Observable<any> {

	return this.http.post( `${ this.backendURL }/register`, data, {
		headers: this.baseHeaders,
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


