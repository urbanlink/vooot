import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../core/auth.service';

@Component({
  selector: module.id,
  templateUrl: 'account.component.html',
  styleUrls: ['_account.component.scss']
})
export class AccountComponent implements OnInit {

  public loading:Boolean;
  private user: any;

  constructor(private auth:AuthService) { }

  public handleAuthenticated() {
    console.log('handleAuthenticated');

  }


  private logout():void {
    console.log('logout');
    this.auth.logout();
  }

  ngOnInit() {
    // get current user
    this.loading = true;

    this.auth.me().subscribe(
      data => {
        // console.log(data);
        this.user = {
          account: this.auth.getAccount(),
          profile: this.auth.getProfile(),
          accessToken: this.auth.getToken()
        }
        this.loading=false;
      },
      error => {
        console.log(error);
        this.loading = false;
      }
    );
  }

}
