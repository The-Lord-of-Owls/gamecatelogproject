import { HttpClient, HttpHeaders } from '@angular/common/http'
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

	private baseHeaders = new HttpHeaders()

	constructor( private http: HttpClient ) {
		this.baseHeaders = this.baseHeaders.set( 'Access-Control-Allow-Origin', '*' )
		this.baseHeaders = this.baseHeaders.set( 'Content-Type', 'application/json' )
	}

	login( data: LoginData ): Observable<any> {
		return this.http.post<any>( `${ this.backendURL }/login`, { password: data.password, email: data.email }, {
			headers: this.baseHeaders
		} )
	}

	logout( data: LogoutData ): Observable<any> {
		return this.http.post<any>( `${ this.backendURL }/logout`, { email: data.email }, {
			headers: this.baseHeaders
		} )
	}

	register( data: RegistationData ): Observable<any> {
		return this.http.post( `${ this.backendURL }/register`, {
			name: data.name,
			email: data.email,
			password: data.password,
			passwordConfirmation: data.passwordConfirmation
		}, {
			headers: this.baseHeaders
		} )
	}

	//Return an array of user's games that they favorited
	fetchMyGames(): Observable<any> {
		return this.http.get<any>( `${ this.backendURL }/my-game` )
	}

	addToMyGames( guid: string ): Observable<any> {
		return this.http.get<any>( `${ this.backendURL }/my-game/add/${ guid }`, {
			headers: this.baseHeaders
		} )
	}

	removeFromMyGames( guid: string ): Observable<any> {
		return this.http.get<any>( `${this.backendURL}/my-game/remove/${ guid }`, {
			headers: this.baseHeaders
		} )
	}

	//Return info about the currently logged in user
	fetchUserInfo(): Observable<any> {
		return this.http.get<any>( `${this.backendURL}/user-info` )
	}
}


