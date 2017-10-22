import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthService,
  AlertService,
  VoootPersonService } from './../../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'person_list.component.html',
    styleUrls: ['_person_list.component.scss']
})

export class PersonListComponent {
    persons:any = {};
    loading:Boolean = false;

    // Setup pagination
    pagination:any = {
      page: 1,
      itemsPerPage: 50
    }

    constructor (
      public auth:AuthService,
      private router: Router,
      private personService: VoootPersonService,
      private alertService: AlertService) { }

    getPersons(options) {
      this.loading = true;
      this.personService.index(options).subscribe(
        data => {
          this.persons = data;
          console.log(this.persons);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
    }

    public doSearch() {

    }

    onPager(event: number): void {
      console.log("Pager event Is: ", event)
      this.pagination.page = event;
      // this.gotoTopic(event - 1);
      this.getPersons({
        offset: (event*this.pagination.itemsPerPage -this.pagination.itemsPerPage),
        limit: this.pagination.itemsPerPage
      });
    }
    ngOnInit() {
      console.log('person_list.component: ngOnInit()');
      this.getPersons({
        limit: this.pagination.itemsPerPage
      });
    }
}
