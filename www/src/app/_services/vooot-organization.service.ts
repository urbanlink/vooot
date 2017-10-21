import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import { AuthHttp } from 'angular2-jwt';
import { Response } from '@angular/http';
import { env } from './../../environments/environment';

@Injectable()
export class VoootOrganizationService {

  //
  private classifications:any;

  //
  constructor(public http:AuthHttp) {}

  // Get a list of organizations
  public index(params:any):Observable<any>  {
    return this.http.get(
      env.apiRoot + '/organization',
      { params: params }
    ).map(res=>res.json());
  }

  // Get a organization based on id
  public get(id:Number):Observable<any> {
    return this.http.get(
      env.apiRoot + '/organization/' + id
    ).map(res=>res.json());
  }

  //
  public create(organization:any):Observable<any> {
    return this.http.post(
      env.apiRoot + '/organization', organization
    ).map(res=>res.json());
  }

  //
  public update(id:Number, organization:any):Observable<any> {
    return this.http.put(
      env.apiRoot + '/organization/' + id, organization
    ).map(res=>res.json());
  }

  //
  public delete(id:Number):Observable<any> {
    return this.http.delete(
      env.apiRoot + '/organization/' + id
    ).map(res=>res.json());
  }

  // Fetch classification details from the API, or serve locally if already fetched.
  public getClassifications():Observable<any> {
    if (this.classifications) {
      return Observable.of(this.classifications);
    } else {
      return this.http.get( env.apiRoot + '/organization/classifications' )
      .map(res => res.json())
      .do((data) => {
        this.classifications = data;
      });
    }
  }

}
