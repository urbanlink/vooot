import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../../_services/index';
import { AuthService } from './../../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private alertService: AlertService) { }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if (this.auth.isLoggedIn) {
      return this.router.navigate([this.returnUrl]);
    }

    this.auth.authUser.subscribe(
      data => {
        this.router.navigate(['/']);
      }
    )
  }

  // Try to login an existing user.
  public login() {
    this.loading = true;
    console.log(this.model);
    this.auth.login(this.model.username, this.model.password)
      .subscribe(
        data => {
          console.log('Logged in!');
          this.loading=false;
          this.router.navigate([this.returnUrl]);
        },
        error => {
          console.log(error);
          this.alertService.error(JSON.parse(error._body).msg);
          this.loading = false;
        });
  }

}
