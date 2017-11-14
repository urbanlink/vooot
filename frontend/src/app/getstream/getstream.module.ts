import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GetStreamService } from './getstream.service';
import { UserTimelineComponent } from './user-timeline/user-timeline.component';
import { PersonFeedComponent } from './person-feed/person-feed.component';
import { UserNotificationsComponent } from './user-notifications/user-notifications.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    UserTimelineComponent,
    PersonFeedComponent,
    UserNotificationsComponent
  ],
  providers: [
    GetStreamService
  ],
  exports: [
    UserTimelineComponent,
    UserNotificationsComponent
  ]
})
export class GetStreamModule { }
