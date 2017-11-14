import { Injectable } from "@angular/core";
import { AuthHttp } from 'angular2-jwt';
import { env } from './../../environments/environment';
import * as stream from 'getstream';
import { Subject, ReplaySubject, Observable } from "rxjs";

@Injectable()
export class GetStreamService {

  private client:any = stream.Client;
  // public notificationUpdate = new ReplaySubject<any>(1);
  public streamBroadcast;

  private authenticated;

  constructor(
    private http:AuthHttp
  ) {
    this.streamBroadcast = new Subject();
    this.client = stream.connect(env.getStream.appKey,null,env.getStream.appId,{ location: 'eu-west' });
    console.log('[getstream.service]\nGetstream connected\n',this.client);
  }


  // Get a read token for a specific stream
  public getToken(params):Observable<any> {
    return this.http.post(env.apiRoot + '/getstream/token', params)
      .map(res=>res.json());
  }


  // Get a feed from the backend
  public getFeedAPI(params):Observable<any> {
    return this.http.get(env.apiRoot + '/getstream/flat', { params: params }).map(res=>res.json());
  }


  // Fetch a flat feed from getstream.io (via backend)
  public getFeed(params):Promise<any> {
    return this.client.feed(params.feedType, params.feedId, params.token).get();
  }


  // Create an activity for a feed at getstream.io (via backend)
  public addActivity(params):Observable<any> {
    return this.http.post(env.apiRoot + '/getstream/activity', params)
      .map(res=>res.json());
  }

  // Subscribe to notifications
  public subscribeNotifications(params):void {
    console.log('[getstream.service]\nSubscribe\n',params);
    let self = this;
    var feed = this.client.feed(params.feedType, params.feedId, params.token);
    feed.subscribe(function(data) {
      console.log('[getstream.service]\nData\n', data);
      self.streamBroadcast.next(data);
    }).then(function(){
      console.log('[getstream.service]\nNow listening to changes in realtime');
    }, function(err) {
      console.warn('[getstream.service]\nError listening to changes in realtime', err);
    });
  }

}
