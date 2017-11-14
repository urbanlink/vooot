// import { env } from './../environments/environment';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService, VoootOrganizationService} from './_services/index';
import { AuthService } from './core/auth.service';

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {

  public loading:Boolean=true;

  constructor(
    public auth:AuthService,
    private router: Router,
    private organizationService: VoootOrganizationService
  ) {
    this.log('app component constructor. ',null);
    this.auth.authUser.subscribe(
      data => {
        this.log('AuthUser object changed: ', data);
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

  private log(msg,obj) {
    console.log('[app.component] \n' + msg + '\n', obj);
  }
}
