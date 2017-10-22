import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AlertService, AuthService, VoootPersonService } from './../../_services/index';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


@Component({
    moduleId: module.id,
    templateUrl: 'person_edit.component.html',
    styleUrls: ['_person_edit.component.scss']
})

export class PersonEditComponent {

  private loading:Boolean = true;
  private contactTypes:any;
  private identifierTypes:any;
  private personId:Number;
  // loaded person
  public person:any;
  // variables to send to backend
  public updatedPerson:any = {};
  public identifier:any = {};
  public contact:any = {};
  public link:any = {};
  public job:any = {};


  public constructor (
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private personService: VoootPersonService,
    private alertService: AlertService,
    private auth:AuthService
  ) {}

  private getPerson():void {
    this.loading = true;
    this.personService.get(this.personId).subscribe(
      data => {
        console.log(data);
        this.person = data;
        this.person.headshot = this.person.headshot || '/assets/img/avatar.png';
        let d=new Date(this.person.birthdate);
        this.person.birthdate = {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()};
        d=new Date(this.person.deathdate);
        if (this.person.deathdate) {
          this.person.deathdate = {year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate()};
        }
        this.loading = false;
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      }
    );
  }


  // Person basics
  public update():void {
    this.loading=true;
    if (this.updatedPerson.birthdate) {
      let b = this.updatedPerson.birthdate;
      this.updatedPerson.birthdate = b.year + '-' + b.month + '-' + b.day;
      this.updatedPerson.birthdate  = new Date(this.updatedPerson.birthdate);
    }

    this.personService.update(this.person.id, this.updatedPerson).subscribe(
      data => {
        this.loading=false;
        this.alertService.success('Updated! ');
        this.updatedPerson = {};
      },
      error => {
        this.loading=false;
        this.alertService.error(JSON.stringify(error.error.msg.parent.code));
      }
    )
  }
  public personModelChange(field, value) {
    this.updatedPerson[field] = value;
  }
  public delete():void {
    console.log('delete');
    this.personService.delete(this.personId).subscribe(
      data => {
        console.log(data)
        if (data=='1') {
          this.router.navigate(['person']);
          this.alertService.success('Person deleted.');
        } else {
          this.alertService.error('Person not deleted.');
        }
      },
      error => console.log(error)
    );
  }
  // Identifier updates
  public addIdentifier():void {
    this.identifier.person_id = this.person.id;
    console.log(this.identifier);
    this.personService.addIdentifier(this.identifier).subscribe(
      data => {
        data['type'] = {};
        for (var i=0; i<this.identifierTypes.length; i++) {
          if (this.identifierTypes[ i].id === data['type_id']) {
            data['type'].value = this.identifierTypes[ i].value;
            break;
          }
        }
        this.person.identifiers.push(data);
        this.alertService.success('Identifier added. ');
        this.identifier = {};
      },
      error => {
        this.identifier = {};
        this.alertService.error(error);
      }
    );
  }
  public updateIdentifier(identifier:any):void {
    var id = {
      value: identifier.value,
      id: identifier.id
    }
    console.log('Update identifier', id);
    this.personService.updateIdentifier(id).subscribe(
      data => {
        console.log(data);
        this.alertService.success('Identifier updated');
      },
      error => {
        console.log('error', error);
        this.alertService.error(JSON.stringify(error));
      }
    )
  }
  public deleteIdentifier(id:Number):void {
    this.personService.deleteIdentifier(id).subscribe(
      data => {
        if (data===1) {
          for (var i=0; i<this.person.identifiers.length; i++) {
            if (this.person.identifiers[ i].id === id) {
              this.person.identifiers.splice(i, 1);
              break;
            }
          }
          this.alertService.success('Identifier deleted.');
        }
      },
      error => {
        this.alertService.error(error);
      }
    )
  }

  // Contact updates
  public addContact():void {
    this.contact.person_id = this.person.id;
    this.personService.addContact(this.contact).subscribe(
      data => {
        data['type'] = {};
        for (var i=0; i<this.contactTypes.length; i++) {
          if (this.contactTypes[ i].id === data['type_id']) {
            data['type'].value = this.contactTypes[ i].value;
            break;
          }
        }
        this.person.contacts.push(data);
      },
      error => {
        this.alertService.error(error);
      }
    );
  }
  public deleteContact(id):void {
    this.personService.deleteContact(this.person.id, id).subscribe(
      data => {
        if (data===1) {
          for (var i=0; i<this.person.contacts.length; i++) {
            if (this.person.contacts[ i].id === id) {
              this.person.contacts.splice(i, 1);
              break;
            }
          }
          this.alertService.success('Contact deleted.');
        }
      },
      error => { this.alertService.error(error); }
    )
  }

  // Link updates
  public addLink():void {
    this.link.person_id = this.person.id;
    this.personService.addLink(this.link).subscribe(
      data => {
        this.person.links.push(data);
        this.alertService.success('Link added. ');
      },
      error => {
        this.alertService.error(error);
      }
    );
  }
  public deleteLink(id:Number):void {
    this.personService.deleteLink(this.person.id, id).subscribe(
      data => {
        for (var i=0; i<this.person.links.length; i++) {
          if (this.person.links[ i].id === id) {
            this.person.links.splice(i, 1);
            break;
          }
        }
        this.alertService.success('Link deleted.');
      },
      error => { this.alertService.error(error); }
    )
  }

  // Job updates
  public addJob():void {
    this.job.person_id = this.person.id;
    if (this.job.startdate) {
      this.job.startdate = this.job.startdate.day + '-' + this.job.startdate.month + '-' + this.job.startdate.year;
    }
    if (this.job.enddate) {
      this.job.enddate = this.job.enddate.day + '-' + this.job.enddate.month + '-' + this.job.enddate.year;
    }

    this.personService.addJob(this.job).subscribe(
      data => {
        this.person.jobs.push(data);
        this.alertService.success('Job added. ');
        this.job = {};
      },
      error => {
        this.alertService.error(error);
      }
    );
  }
  public deleteJob(id:Number):void {
    console.log('Deleting link: ' + id);
    console.log('For ' + this.person);
    this.personService.deleteJob(this.person.id, id).subscribe(
      data => {
        for (var i=0; i<this.person.jobs.length; i++) {
          if (this.person.jobs[ i].id === id) {
            this.person.jobs.splice(i, 1);
            break;
          }
        }
        this.alertService.success('Job deleted.');
      },
      error => { this.alertService.error(error); }
    )
  }


  // initialization of the view.
  public ngOnInit():void {
    // Get route params
    this.activatedRoute.params
      .subscribe((params) => {
        this.personId = params['id'];
        // fetch the person
        this.getPerson();
      });

    // Get contact types
    this.personService.getContactTypes().subscribe(
      data => { this.contactTypes = data; },
      error => { this.alertService.error(error); }
    )
    this.personService.getIdentifierTypes().subscribe(
      data => { this.identifierTypes = data; console.log(data); },
      error => { this.alertService.error(error); }
    )
  }
}
