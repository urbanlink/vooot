import { Component, OnInit } from '@angular/core';
import { AuthService } from './../core/auth.service';
import { GetStreamService } from './../getstream/getstream.service';
import * as GetStream from './../getstream/getstream.module';
import {UserTimelineComponent} from './../getstream/user-timeline/user-timeline.component';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls:['_home.component.scss']
})

export class HomeComponent implements OnInit {

  public timeline:any;

  constructor(
    private auth:AuthService,
    private streamService:GetStreamService) {}


  public ngOnInit():void {
    // this.streamService.notificationUpdate.subscribe(
    //   data => function(data) {
    //     console.log(data);
    //   },
    //   err => function(err) {
    //     console.log(err);
    //   }
    // );
    //
    //
    //
    // // Get notification stream
    // this.streamService.getToken({ feedType: 'notification', feedId: this.auth.getAccountId() }).subscribe(
    //   data => {
    //     console.log(data);
    //     console.log('subscribing to user feed. ');
    //     this.streamService.subscribe(data);
    //   }
    // );
  }
}
