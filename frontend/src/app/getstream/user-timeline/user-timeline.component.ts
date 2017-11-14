import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../core/auth.service';
import { GetStreamService } from './../getstream.service';

@Component({
  selector: 'user-timeline',
  templateUrl: './user-timeline.component.html',
  styleUrls: ['./user-timeline.component.scss']
})
export class UserTimelineComponent implements OnInit {

  public timeline:any;

  constructor(
    private auth: AuthService,
    private getStreamService: GetStreamService
  ) { }

  // Get timeline stream for current user
  private getTimeline() {
    // first get a read token from API
    let params:any = {
      feedType: 'timeline',
      feedId: String(this.auth.getAccountId())
    }
    console.log('params', params);
    this.getStreamService.getToken(params).subscribe(
      token => {
        console.log('[user-timeline]\nToken received for reading timeline\n', token);
        params.token = token;
        console.log('[user-timeline]\nParams\n', params);
        this.getStreamService.getFeed(params).then(
          data => {
            console.log('[user-timeline]\nTimeline received\n', data);
            this.timeline = data.results;
          },
          err => {
            console.warn('[user-timeline]\n', err);
          }
        )
      },
      err => {
        console.warn('[user-timeline]\n', err);
      }
    );
  }

  ngOnInit() {
    console.log('[user-timeline]\nIs logged in:\n', this.auth.isLoggedIn() );
    this.getTimeline();
  }
}
