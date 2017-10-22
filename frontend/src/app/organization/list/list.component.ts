import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthService,
  AlertService,
  VoootOrganizationService } from './../../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'organization_list.component.html',
    styleUrls: ['_organization_list.component.scss']
})

export class OrganizationListComponent {
    municipalities = {};
    loading = false;

    constructor (
      private router: Router,
      private auth:AuthService,
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

    ngOnInit() {
      console.log('organization_list.component: ngOnInit()');
      this.getMunicipalities();
    }
}
