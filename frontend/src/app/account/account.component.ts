import { Component, OnInit } from '@angular/core';
import { AuthService } from './../_services/index';

@Component({
  selector: module.id,
  templateUrl: 'account.component.html',
  styleUrls: ['_account.component.scss']
})
export class AccountComponent implements OnInit {

  private user: any;
  loading:Boolean;

  constructor(private auth:AuthService) { }

  private logout():void {
    console.log('logout');
    this.auth.logout();
  }

  ngOnInit() {
    // get current user
    this.loading = true;
    this.auth.me().subscribe(
      data => {
        console.log(data);
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
