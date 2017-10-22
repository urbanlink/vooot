import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/index';

@Component({
  selector: 'app-nav',
  templateUrl: 'nav.component.html',
  styleUrls: ['_nav.component.scss']
})
export class NavComponent implements OnInit {

  private navbarCollapsed:boolean = true;

  constructor(private auth:AuthService) { }

  ngOnInit() {}

}
