import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../core/auth.service';
import {
  AlertService,
  VoootOrganizationService } from './../../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'organization_list.component.html',
    styleUrls: ['_organization_list.component.scss']
})

export class OrganizationListComponent {
    public municipalities:any = {};
    public loading:Boolean = false;

    constructor (
      private router: Router,
      public auth:AuthService,
      private organizationService: VoootOrganizationService,
      private alertService: AlertService) { }

    getMunicipalities() {
      this.loading = true;
      this.organizationService.index({
        classification_id: '1'
      }).subscribe(
        data => {
          this.municipalities = data;
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
    }

    public doSearch() {

    }

    ngOnInit() {
      console.log('organization_list.component: ngOnInit()');
      this.getMunicipalities();
    }
}
