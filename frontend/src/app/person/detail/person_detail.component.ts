import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthService, VoootPersonService } from './../../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'person_detail.component.html',
    styleUrls: ['_person_detail.scss']
})

export class PersonDetailComponent {

    public loading:Boolean = false;
    private personId:Number = null;
    private person:Object = {};

    public constructor (
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private personService: VoootPersonService,
      private alertService: AlertService,
      private auth:AuthService
    ) {}

    private getPerson(): void {
      this.loading = true;
      this.personService.get(this.personId).subscribe(
        data => {
          console.log(data);
          data.headshot = data.headshot || '/assets/img/avatar.png';
          this.person = data;
          this.loading = false;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        }
      );
    }

    public ngOnInit(): void {
      console.log(this.auth.isAdmin());
      this.activatedRoute.params
        .subscribe((params) => {
          this.personId = params['id'];
          this.getPerson();
        });
    }
}
