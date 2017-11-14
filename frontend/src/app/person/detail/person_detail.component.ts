import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, VoootPersonService } from './../../_services/index';
import { AuthService } from './../../core/auth.service';
import { GetStreamService } from './../../getstream/getstream.service';

@Component({
    moduleId: module.id,
    templateUrl: 'person_detail.component.html',
    styleUrls: ['_person_detail.scss']
})

export class PersonDetailComponent {

    public loading:Boolean = false;
    private personId:Number = null;
    private person:any = {};
    private stream:any;

    public constructor (
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private personService: VoootPersonService,
      private alertService: AlertService,
      private auth:AuthService,
      private getStreamService: GetStreamService
    ) {}

    private getPerson(): void {
      this.loading = true;
      this.personService.get(this.personId).subscribe(
        data => {
          console.log(data);
          data.headshot = data.headshot || '/assets/img/avatar.png';
          this.person = data;
          this.loading = false;
          this.getStream();
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
    }

    public createActivity(id):void {
      console.log(id);
      let activity = {
        actor: 'person:1',
        verb: 'add',
        object: 'picture:10',
        message: 'Working on improving the user experience of the Stream Dashboard...'
      }
      this.getStreamService.addActivity(activity).subscribe(
        (data)=>{
          console.log(data);
        },
        (err)=>{
          console.log(err);
        });
    }

    // Get the getstream.io person feed from the API
    public getStream():void {
      console.log('[person_detail.component] getFeed called (API)');
      this.getStreamService.getFeedAPI({
        feedType: 'person',
        feedId: this.person.id
      }).subscribe(
        (data) => {
          this.stream = data;
          console.log('[person_detail.component] Data:', data);
        },
        (err) => {
          console.log('[person_detail.component] Error:', err);
        }
      );
    }

    //
    public ngOnInit(): void {
      console.log(this.auth.isAdmin());
      this.activatedRoute.params
        .subscribe((params) => {
          this.personId = params['id'];
          this.getPerson();
        });
    }
}
