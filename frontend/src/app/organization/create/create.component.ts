import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../core/auth.service';
import { AlertService, VoootOrganizationService } from './../../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'create.component.html',
    styleUrls: ['_create.component.scss']
})

export class OrganizationCreateComponent {

  public loading:Boolean;
  public organization:any = {};
  public classifications:any = {};

  public constructor (
    private router: Router,
    private organizationService: VoootOrganizationService,
    private alertService: AlertService,
    private auth:AuthService
  ) {}

  // organization basics
  public create():void {
    this.loading=true;
    this.organizationService.create(this.organization).subscribe(
      data => {
        console.log(data);
        this.loading=false;
        this.router.navigate(['organization', data['id'], 'edit']);
        this.alertService.success('Created! ');
      },
      error => {
        this.loading=false;
        this.alertService.error(JSON.stringify(error.error.msg.parent.code));
      }
    )
  }

  // initialization of the view.
  public ngOnInit():void {
    this.loading=true;
    // this.organizationService.getClassifications().subscribe(
    //   data => {
    //     this.classifications = data;
    //     this.organization.classification_id = data.filter(classification => classification.value === 'municipality')[0].id;
    //     this.loading = false;
    //   },
    //   error => {
    //     this.alertService.error(error);
    //     this.loading = false;
    //   }
    // )
  }
}
