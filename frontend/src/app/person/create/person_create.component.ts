import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthService, VoootPersonService } from './../../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'person_create.component.html',
    styleUrls: ['_person_create.component.scss']
})

export class PersonCreateComponent {

  public loading:Boolean;
  public person:any = {};

  public constructor (
    private router: Router,
    private personService: VoootPersonService,
    private alertService: AlertService,
    private auth:AuthService
  ) {}

  // Person basics
  public create():void {
    this.loading=true;
    this.personService.create(this.person).subscribe(
      data => {
        this.loading=false;
        this.router.navigate(['person', data['id'], 'edit']);
        this.alertService.success('Created! ');
      },
      error => {
        this.loading=false;
        this.alertService.error(JSON.stringify(error.error.msg.parent.code));
      }
    )
  }

  // initialization of the view.
  public ngOnInit():void {}
}
