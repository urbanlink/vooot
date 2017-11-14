import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AlertService, VoootPersonService } from './../../_services/index';
import { AuthService } from './../../core/auth.service';

@Component({
    moduleId: module.id,
    templateUrl: 'person_list.component.html',
    styleUrls: ['_person_list.component.scss']
})

export class PersonListComponent {
  public persons:any = {};
  public loading:Boolean = false;
  public search:any = {
    term: '',
    result: []
  }

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
    this.loading=true;
    this.personService.search(this.search.term).subscribe(
      data => {
        this.persons = data;
      },
      error => {
        this.alertService.error(error);
        this.loading=false;
      }
    )
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
