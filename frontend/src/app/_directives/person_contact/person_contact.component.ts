import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'personcontact',
    templateUrl: 'person_contact.component.html',
    styleUrls: ['_person_contact.component.scss']
})

export class PersonContactComponent {

  @Input('contacts') data;

  public contacts:any = [];

  private icons = {
    address_work: 'building',
    address_home: 'home',
    twitter: 'twitter',
    facebook: 'facebook',
    instagram: 'instagram',
    linkedin: 'linkedin',
    phone: 'phone',
    phone_mobile: 'mobile',
    email_work: 'email',
    email_personal: 'email'
  };

  private links = {
    twitter: 'https://twitter.com/',
    facebook: 'https://facebook.com/',
    linkedin: 'https://linkedin.com/'
  }

  constructor() {}

  // Restructure the contact information for display.
  private parseContacts() {
    for (var key in this.data) {
      let c = {
        icon: this.icons[this.data[key].type.value],
        value: this.data[ key].value
      }
      if (this.links[this.data[ key].type.value]) {
        c.value = '<a href="' + this.links[this.data[ key].type.value] + this.data[ key].value + '" target="_blank">' + this.data[ key].value + '</a>';
      }
      this.contacts.push(c);
    }
  }

  ngOnInit() {
    this.parseContacts();
  }
}
