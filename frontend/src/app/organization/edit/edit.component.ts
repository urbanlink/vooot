import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../core/auth.service';
import { AlertService, VoootOrganizationService } from './../../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'organization_edit.component.html',
    styleUrls: ['_organization_edit.component.scss']
})

export class OrganizationEditComponent {

  public loading:Boolean = true;
  private organizationId:Number;
  public organization:any;
  public updatedOrganization:any = {};

  public constructor (
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private organizationService: VoootOrganizationService,
    private alertService: AlertService,
    private auth:AuthService
  ) {}

  private getOrganization():void {
    this.loading = true;
    this.organizationService.get(this.organizationId).subscribe(
      data => {
        this.organization = data;
        this.loading = false;
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }


  // Organization basics
  public update():void {
    console.log('update', this.updatedOrganization);
    this.loading=true;
    if (this.updatedOrganization.foundingdate) {
      let b = this.updatedOrganization.foundingdate;
      this.updatedOrganization.foundingdate = b.year + '-' + b.month + '-' + b.day;
      this.updatedOrganization.foundingdate  = new Date(this.updatedOrganization.foundingdate);
    }

    if (this.updatedOrganization.dissolutiondate) {
      let b = this.updatedOrganization.dissolutiondate;
      this.updatedOrganization.dissolutiondate = b.year + '-' + b.month + '-' + b.day;
      this.updatedOrganization.dissolutiondate  = new Date(this.updatedOrganization.dissolutiondate);
    }

    this.organizationService.update(this.organization.id, this.updatedOrganization).subscribe(
      data => {
        console.log(data);
        this.loading=false;
        this.alertService.success('Updated! ');
        this.updatedOrganization = {};
      },
      error => {
        console.log(error);
        this.loading=false;
        this.alertService.error(JSON.stringify(error.error.msg.parent.code));
      }
    )
  }
  public organizationModelChange(field, value) {
    this.updatedOrganization[field] = value;
  }
  public delete():void {
    console.log('delete');
    this.organizationService.delete(this.organizationId).subscribe(
      data => {
        console.log(data)
        if (data=='1') {
          this.router.navigate(['organization']);
          this.alertService.success('Organization deleted.');
        } else {
          this.alertService.error('Organization not deleted.');
        }
      },
      error => console.log(error)
    );
  }

  // initialization of the view.
  public ngOnInit():void {
    // Get route params
    this.activatedRoute.params.subscribe((params) => {
      this.organizationId = params['id'];
      // fetch the organization
      this.getOrganization();
    });
  }
}
