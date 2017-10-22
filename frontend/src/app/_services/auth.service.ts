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

  // Check if there is a current user that can be logged in
  // ( validate or renew JWT Token )
  public checkLogin():void {
    // Return true if user has a valid token.
    console.log('checkLogin() - Validate login status. ');
    if (this.isLoggedIn()) {
      console.log('checkLogin() - User is looged in. ');
      return this.authUser.next(true);
    }
    // Return false if there is not token present.
    console.log('checkLogin() - getAccessToken. ');
    if (!this.getToken())  {
      console.log('checkLogin() - No access token present. User nog logged in and no session. ');
      return this.authUser.next(false);
    }

    // There is an old token present, try to renew this token.
    console.log('checkLogin() - Trying to get a new access token with the refreshToken. ');
    this.updateToken().subscribe(
      data => {
        console.log('checkLogin() - access token updated. ', data);
        this.authUser.next(true)
      },
      error => {
        console.log('Error updating token', error);
        this.authUser.next(false);
      }
    );
  }

  // Validate JWT token and expiration date in localStorage
  public isLoggedIn():Boolean { return tokenNotExpired(); }

  public isAdmin():Boolean {
    console.log('isAdmin() - validating if current user has admin role. ');
    let account:any = this.getAccount();
    return (account.roles && account.roles.indexOf(1) !== -1);
  }

  public getToken():String {
    return localStorage.getItem('token');
  }

  public getAccount() {
    let a = localStorage.getItem('account');
    let account = {};
    if (a!='undefined') {
      account = JSON.parse(a);
    }
    return account;
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
        console.log('updateToken() - result: ', data);

        if (data.token && data.token.access_token) {
          console.log('updateToken() - Setting local storage. ');
          localStorage.setItem('account', JSON.stringify(data.account));
          localStorage.setItem('profile', JSON.stringify(data.profile));
          localStorage.setItem('token', data.token.access_token);
        } else {
          console.log('updateToken() - No token received. logout. ');
          this.logout();
        }
      }
    );
  }


  // Register a new user.
  public register(params) {
    console.log('Starting registration');
    console.log(params);
    return this.authHttp.post(
      env.apiRoot + '/account/login',
      params
    ).map((response:Object) => {
      console.log('response');
      return response;
    });
  }

  // Login an existing user.
  public login(username: string, password: string) {
    console.log('authService - login');
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
        console.log('Something went wrong: ', user);
      }

      return response;
    });
  }

  //
  public logout() {
    // remove user from local storage to log user out
    console.log('logout current user. ');
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
    console.log('authService - profile');
    return this.authHttp.post(
      env.apiRoot + '/account/me',{}
    ).map((response:Response) => {
      let user = response.json();
      console.log(user);
      localStorage.setItem('account', JSON.stringify(user.account));
      localStorage.setItem('profile', JSON.stringify(user.profile));
      console.log('Profile updated', user);

      return user;
    });
  }

}
