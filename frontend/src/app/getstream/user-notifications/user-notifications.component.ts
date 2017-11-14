import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../core/auth.service';
import { GetStreamService } from './../getstream.service';

@Component({
  selector: 'user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss']
})
export class UserNotificationsComponent implements OnInit {

  public notifications:any = [];

  constructor(
    private auth:AuthService,
    private getStreamService:GetStreamService) { }

  private subscribeNotifications() {
    let params:any = {
      feedType: 'user',
      feedId: String(this.auth.getAccountId())
    }
    console.log('[user-notifications.component]\nParams\n', params);
    this.getStreamService.getToken(params).subscribe(
      token => {
        console.log('[user-notifications.component]\nToken received for reading timeline. \n', token);
        params.token = token;
        console.log('[user-notifications.component]\nParamsn\n', params);
        let self = this;
        var someSubscriber = this.getStreamService.streamBroadcast
          .subscribe(function(value) {
            console.log('Got value: ', value);
            let n:any = value.new;
            self.notifications = n.concat(self.notifications);
          });

        this.getStreamService.subscribeNotifications(params);
        // .then(
        //   data => {
        //     console.log('[user-notifications.component]\nTimeline received.\n', data);
        //     this.timeline = data.results;
        //   },
        //   err => {
        //     console.log('[user-notifications.component]\nError\n', err);
        //   }
        // )
      },
      err => {
        console.log('Error: ', err);
      }
    );
  }

  ngOnInit() {
    console.log('[user-notifications.component]\nngOnInit');
    this.subscribeNotifications();

  }

}
