import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { AuthHttp } from 'angular2-jwt';
import { Response } from '@angular/http';
import { env } from './../../environments/environment';

@Injectable()
export class VoootPersonService {

  private contactTypes:any;

  constructor(public http:AuthHttp) {}

  // Get a list of persons
  public index(params:Object):Observable<any> {
    return this.http.get(
      env.apiRoot + '/person',
      {
        params: params
      }
    ).map(res=>res.json());
  }

  // Get a person based on id
  public get(id:Number):Observable<any> {
    return this.http.get(
      env.apiRoot + '/person/' + id
    ).map(res=>res.json());
  }

  public create(person:any):Observable<any> {
    return this.http.post(
      env.apiRoot + '/person', person
    ).map(res=>res.json());
  }

  public update(id:Number, person:any):Observable<any> {
    return this.http.put(
      env.apiRoot + '/person/' + id, person
    ).map(res=>res.json());
  }

  public delete(id:Number):Observable<any> {
    return this.http.delete(
      env.apiRoot + '/person/' + id
    ).map(res=>res.json());
  }

  public search(term:any):Observable<any> {
    console.log(term);
    return this.http.get(
      env.apiRoot + '/person/query?term=' + term
    ).map(res=>res.json());
  }

  public getIdentifierTypes():Observable<any> {
    return this.http.get(
      env.apiRoot + '/identifier/types'
    ).map(res=>res.json());
  }
  // Ad an identifier to a person
  public addIdentifier(params:Object):Observable<any> {
    return this.http.post(
      env.apiRoot + '/identifier', params
    ).map(res=>res.json());
  }
  // Delete an identifier from a person
  public updateIdentifier(identifier:any):Observable<any> {
    console.log('Service update:', identifier);
    return this.http.put(
      env.apiRoot + '/identifier/'+ identifier.id, identifier
    ).map(res=>res.json());
  }
  // Delete an identifier from a person
  public deleteIdentifier(id:Number):Observable<any> {
    return this.http.delete(
      env.apiRoot + '/identifier/'+ id
    ).map(res=>res.json());
  }

  // Ad a contact to a person
  public addContact(params:any):Observable<any> {
    return this.http.post(
      env.apiRoot + '/person/' + params.person_id + '/contact', params
    ).map(res=>res.json());
  }
  // Delete an identifier from a person
  public deleteContact(personId:Number, contactId:Number):Observable<any> {
    return this.http.delete(
      env.apiRoot + '/person/' + personId + '/contact/'+ contactId
    ).map(res=>res.json());
  }

  // Ad a link to a person
  public addLink(params:any):Observable<any> {
    return this.http.post(
      env.apiRoot + '/link', params
    ).map(res=>res.json());
  }
  // Delete an identifier from a person
  public deleteLink(personId:Number, linkId:Number):Observable<any> {
    return this.http.delete(
      env.apiRoot + '/link/' + linkId
    ).map(res=>res.json());
  }

  // Ad a job to a person
  public addJob(params:any):Observable<any> {
    return this.http.post(
      env.apiRoot + '/person/' + params.person_id + '/job', params
    ).map(res=>res.json());
  }
  // Delete an identifier from a person
  public deleteJob(personId:Number, jobId:Number):Observable<Object> {
    return this.http.delete(
      env.apiRoot + '/person/' + personId + '/job/' + jobId
    ).map(res=>res.json());
  }


  // Fetch classification details from the API, or serve locally if already fetched.
  public getContactTypes():Observable<any> {
    if (this.contactTypes) {
      return Observable.of(this.contactTypes);
    } else {
      return this.http.get( env.apiRoot + '/person/contact-types' )
      .map(res => res.json())
      .do((data) => {
        this.contactTypes = data;
      });
    }
  }
}
