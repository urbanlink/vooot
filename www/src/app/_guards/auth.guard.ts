import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate } from '@angular/router';
import { AuthService } from './../_services/index';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate() {
    console.log('Checking: Can activate. ');
    if (this.auth.isLoggedIn()) {
      return true;
    }

    console.log('not authenticated');
    this.router.navigate(['login']);
    return false;
  }
}
