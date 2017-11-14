import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from "rxjs";
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';
import { tokenNotExpired } from 'angular2-jwt';
import { AuthHttp } from 'angular2-jwt';
import { Http, Response } from '@angular/http';
import { env } from './../../environments/environment';

@Injectable()
export class AuthService {

  public authUser = new ReplaySubject<any>(1);

  constructor(
    public http:Http,
    public authHttp:AuthHttp,
    private router:Router
  ) {}

  public handleAuthenticated() {

  }

  public handleNotAuthenticated() {

  }
  // Check if there is a current user that can be logged in
  // ( validate or renew JWT Token )
  public checkLogin():void {
    // Return true if user has a valid token.
    console.log('[auth.service] Validate login status.');
    if (this.isLoggedIn()) {
      console.log('[auth.service] User is looged in. ');
      return this.authUser.next(true);
    }
    // Return false if there is not token present.
    console.log('[auth.service] getAccessToken. ');
    if (!this.getToken())  {
      console.log('[auth.service] No access token present. User nog logged in and no session. ');
      return this.authUser.next(false);
    }

    // There is an old token present, try to renew this token.
    console.log('[auth.service] Trying to get a new access token with the refreshToken. ');
    this.updateToken().subscribe(
      data => {
        console.log('[auth.service] Access token updated. ', data);
        this.authUser.next(true)
      },
      error => {
        console.log('[auth.service] Error updating token', error);
        this.authUser.next(false);
      }
    );
  }

  // Validate JWT token and expiration date in localStorage
  public isLoggedIn():Boolean { return tokenNotExpired(); }

  public isAdmin():Boolean {
    // console.log('[auth.service] isAdmin() - validating if current user has admin role. ');
    let account:any = this.getAccount();
    return (account.roles && account.roles.indexOf(1) !== -1);
  }

  public getToken():String {
    return localStorage.getItem('token');
  }

  public getAccount():any {
    let a = localStorage.getItem('account');
    let account = {};
    if (a!='undefined') {
      account = JSON.parse(a);
    }
    return account;
  }

  public getAccountId():Number {
    return this.getAccount().id;
  }

  public getProfile() {
    let p = localStorage.getItem('profile');
    let profile = {};
    if (p!='undefined') {
      profile = JSON.parse(p);
    }
    return profile;
  }

  // Update the token using a refresh token.
  public updateToken():Observable<any> {
    return this.http.post(
      env.apiRoot + '/account/token', {
        refresh_token: localStorage.getItem('refreshToken')
      })
      .map(res=>res.json())
      .do((data) => {
        console.log('[auth.service] updateToken() result: ', data);

        if (data.token && data.token.access_token) {
          console.log('[auth.service] updateToken() Setting local storage. ');
          localStorage.setItem('account', JSON.stringify(data.account));
          localStorage.setItem('profile', JSON.stringify(data.profile));
          localStorage.setItem('token', data.token.access_token);
        } else {
          console.log('[auth.service] updateToken() No token received. logout. ');
          this.logout();
        }
      }
    );
  }


  // Register a new user.
  public register(params) {
    console.log('[auth.service] Starting registration', params);
    return this.authHttp.post(
      env.apiRoot + '/account/login',
      params
    ).map((response:Object) => {
      console.log('[auth.service] response');
      return response;
    });
  }

  // Login an existing user.
  public login(username: string, password: string) {
    console.log('[auth.service] authService - login');
    return this.http.post(
      env.apiRoot + '/account/login', {
        username: username,
        password: password
      }
    )
    .map((response: Response) => {
      let user = response.json();
      if (user && user.token) {
        localStorage.setItem('account', JSON.stringify(user.account));
        localStorage.setItem('profile', JSON.stringify(user.profile));
        localStorage.setItem('token', user.token.access_token);
        localStorage.setItem('refreshToken', user.token.refresh_token);
      } else {
        console.log('[auth.service] Something went wrong: ', user);
      }

      return response;
    });
  }

  //
  public logout() {
    // remove user from local storage to log user out
    console.log('[auth.service] logout current user. ',null);
    localStorage.removeItem('account');
    localStorage.removeItem('profile');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');

    this.router.navigate(['login']);
  }

  //
  public requestPassword(email:string):Observable<any> {
    return this.http.post(
      env.apiRoot + '/account/forgot-password', {
        email: email
      }).map(res=>res.json());
  }

  //
  public submitPassword(params:any):Observable<any> {
    return this.http.post(
      env.apiRoot + '/account/change-password', {
        email: params.email,
        key: params.key,
        password: params.password
      }).map(res=>res.json());
  }

  public me():Observable<Object> {
    console.log('[auth.service] authService - profile',null);
    return this.authHttp.post(
      env.apiRoot + '/account/me',{}
    ).map((response:Response) => {
      let user = response.json();
      console.log('[auth.service] user', user);
      localStorage.setItem('account', JSON.stringify(user.account));
      localStorage.setItem('profile', JSON.stringify(user.profile));
      console.log('[auth.service] Profile updated', user);

      return user;
    });
  }

}
