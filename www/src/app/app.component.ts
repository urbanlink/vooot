// import { env } from './../environments/environment';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertService,
  AuthService,
  VoootOrganizationService } from './_services/index';

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: 'app.component.html'
})

export class AppComponent {

  public loading:Boolean=true;

  constructor(
    public auth:AuthService,
    private router: Router,
    private organizationService: VoootOrganizationService
  ) {
    console.log('app component constructor. ');
    this.auth.authUser.subscribe(
      data => {
        console.log('AuthUser object changed: ', data);
        this.loading=false;
        // TODO: go to dashboard
        // this.router.navigate(['/home']);
      },
      error => {
        console.log(error);
        // this.loading=false;
      }

    )
  }

  private doSearch() {

  }

  ngOnInit() {
    this.auth.checkLogin();
  }
}
