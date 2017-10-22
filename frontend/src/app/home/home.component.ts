import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html',
    styleUrls:['_home.component.scss']
})

export class HomeComponent implements OnInit {

  constructor () {}

  public ngOnInit():void { }
}
