import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import { AuthHttp } from 'angular2-jwt';
import { Response } from '@angular/http';
import { env } from './../../environments/environment';

@Injectable()
export class VoootMembershipService {

  //
  private roleTypes:any;

  //
  constructor(public http:AuthHttp) {}

  // Get a list of memberships
  public index(params:any):Observable<any>  {
    return this.http.get(
      env.apiRoot + '/membership',
      { params: params }
    ).map(res=>res.json());
  }

  // Get a membership based on id
  public get(id:Number):Observable<any> {
    return this.http.get(
      env.apiRoot + '/membership/' + id
    ).map(res=>res.json());
  }

  //
  public create(membership:any):Observable<any> {
    return this.http.post(
      env.apiRoot + '/membership', membership
    ).map(res=>res.json());
  }

  //
  public update(id:Number, membership:any):Observable<any> {
    return this.http.put(
      env.apiRoot + '/membership/' + id, membership
    ).map(res=>res.json());
  }

  //
  public delete(id:Number):Observable<any> {
    return this.http.delete(
      env.apiRoot + '/membership/' + id
    ).map(res=>res.json());
  }

  // Fetch classification details from the API, or serve locally if already fetched.
  public getRoleTypes():Observable<any> {
    if (this.roleTypes) {
      return Observable.of(this.roleTypes);
    } else {
      return this.http.get( env.apiRoot + '/membership/role-types' )
      .map(res => res.json())
      .do((data) => {
        this.roleTypes = data;
      });
    }
  }

}
