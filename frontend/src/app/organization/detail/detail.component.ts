import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  AlertService,
  AuthService,
  VoootMembershipService,
  VoootOrganizationService } from './../../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'organization_detail.component.html',
    styleUrls: ['_organization_detail.scss']
})

export class OrganizationDetailComponent {

  public loading:Boolean = false;
  // Loaded content
  private organizationId:Number = null;
  private organization:any = {};
  private councils:any = [];
  private selectedCouncil:Number;
  private committees:any = [];
  private selectedCommittee:Number;

  // Organization edit/add
  public displayOrganizationForm:Boolean;
  private organizationClassifications:any = {};
  private newOrganization:any = {};

  // membership edit/add
  public displayMembershipForm:Boolean;
  private membershipRoleTypes:any = [];
  private newMembership:any = {};
  private memberships = {
    municipality: [],
    council: [],
    committees: []
  }

  public constructor (
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private organizationService: VoootOrganizationService,
    private membershipService: VoootMembershipService,
    private alertService: AlertService,
    public auth:AuthService
  ) {}

  // Get the municipality
  private getMunicipality(): void {
    this.loading = true;
    this.organizationService.get(this.organizationId).subscribe(
      data => {
        this.organization = data;
        this.loading = false;
        this.getCouncils();
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }

  // Get the council for the selected municipality
  private getCouncils():void {
    this.organizationService.index({
      parent_id: this.organization.id,
      classification_id: 2
    }).subscribe(
      data => {
        this.councils = data.rows;
        this.selectCouncil(data.rows[ 0].id);
        this.getCommittees();
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  private selectCouncil(id:Number) {
    console.log('Select the council: ' + id);
    this.selectedCouncil = id;
    this.membershipService.index({
      organization_id: id,
      role_id: 1
    }).subscribe(
      data => {
        console.log(data.rows);
        this.memberships.council = data.rows;
      },
      error => {
        this.alertService.error(error);
      }
    );
    this.getCommittees();
  }


  // Get the committees for the selected council
  private getCommittees():void {
    this.organizationService.index({
      parent_id: this.selectedCouncil,
      classification_id: 3
    }).subscribe(
      data => {
        this.committees = data.rows;
        let s;
        if (data.rows[ 0] && data.rows[ 0].id) {
          s = data.rows[ 0].id;
        }
        this.selectedCommittee = s;
      },
      error => {
        this.alertService.error(error);
      }
    )
  }


  private showOrganizationForm(options) {
    console.log(options);
    console.log('municipality id: ' + this.organization.id );
    this.displayOrganizationForm = true;
    this.newOrganization = options.organization || {};

    switch(options.type) {
      case 'council':
        if (!options.organization) {
          this.newOrganization.classification_id=2;
          this.newOrganization.parent_id = this.organization.id;
        }
      break;
      case 'committee':
        if (!options.organization) {
          this.newOrganization.classification_id=3;
          this.newOrganization.parent_id = this.selectedCouncil;
        }
        break;
    }
  }

  private updateOrganization() {
    if (this.newOrganization.foundingdate) {
      let b = this.newOrganization.foundingdate;
      this.newOrganization.foundingdate = b.year + '-' + b.month + '-' + b.day;
      this.newOrganization.foundingdate  = new Date(this.newOrganization.foundingdate);
    }

    if (this.newOrganization.dissolutiondate) {
      let b = this.newOrganization.dissolutiondate;
      this.newOrganization.dissolutiondate = b.year + '-' + b.month + '-' + b.day;
      this.newOrganization.dissolutiondate  = new Date(this.newOrganization.dissolutiondate);
    }
    this.organizationService.update(this.newOrganization.id, this.newOrganization).subscribe(
      data => {
        this.displayOrganizationForm = false;
        this.newOrganization = null;
        this.alertService.success('Update success! ');
      },
      error => {
        this.alertService.error(error);
      }
    );
  }

  private submitOrganization():void {
    console.log('addOrganization', this.newOrganization);
    this.organizationService.create(this.newOrganization).subscribe(
      data => {
        this.displayOrganizationForm = false;
        this.newOrganization = null;
        this.alertService.success('Update success! ');
      },
      error => {
        this.alertService.error(error);
      }
    )
  }

  private addCommittee():void {
    this.newOrganization.parent_id = this.selectedCouncil;
    this.newOrganization.classification_id = 3;
    console.log('addCommittee', this.newOrganization);
    this.organizationService.create(this.newOrganization).subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
      }
    )
  }


  private showMembershipForm(options) {
    this.displayMembershipForm=true;
    this.newMembership = options.membership || {};
    switch(options.type) {
      case 'council':
        if (!options.membership) {
          this.newMembership.organization_id = this.selectedCouncil;
          this.newMembership.role_id = 1;
        }
        break;
    }
  };

  private submitMembership():void {
    console.log('addMembership', this.newMembership);
    this.membershipService.create(this.newMembership).subscribe(
      data => {
        this.displayMembershipForm = false;
        this.newMembership = null;
        this.alertService.success('Update success! ');
      },
      error => {
        this.alertService.error(error);
      }
    )
  }

  public ngOnInit(): void {
    this.activatedRoute.params
      .subscribe((params) => {
        this.organizationId = params['id'];
        this.organizationService.getClassifications().subscribe(data => {
          this.organizationClassifications = data;
        });
        this.membershipService.getRoleTypes().subscribe(data => {
          this.membershipRoleTypes = data;
        });
        // Get the selected municipality
        this.getMunicipality();
      });
  }
}
