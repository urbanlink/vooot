import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate() {
    console.log('[auth.guard] Checking: Can activate. ');
    if (this.auth.isLoggedIn()) {
      return true;
    }

    console.log('[auth.guard] Not authenticated');
    this.router.navigate(['login']);
    return false;
  }
}
