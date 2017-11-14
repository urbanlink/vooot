import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../core/auth.service';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {

  private navbarCollapsed:boolean = true;

  constructor(
    public auth:AuthService) { }

  ngOnInit() { }

}
