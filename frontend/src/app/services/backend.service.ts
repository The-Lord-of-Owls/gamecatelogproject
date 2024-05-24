import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

@Injectable( {
  providedIn: 'root'
} )
export class BackendService {
  private backendURL: String = "http://localhost/api/"

  constructor( private http: HttpClient ) { }

  //Stub functions for handling logging in/out(consolt Auth0/Angular docks)
  //These may not be necessary yet. Here for now while consolting docs
  login(): void {}
  logout(): void {}

  //Return an array of user's games that they favorited
  fetchMyGames(): Observable<any> {
    return this.http.get<any>( `${ this.backendURL }/my-game` )
  }

  //Return info about the currently logged in user
  fetchUserInfo(): Observable<any> {
    return this.http.get<any>( `${ this.backendURL }/user-info` )
  }
}


