import { Component, OnInit } from '@angular/core';
import { env } from './../../../environments/environment';
import { AuthService } from './../../core/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  private version:string= env.version;

  constructor(public auth:AuthService) { }

  ngOnInit() {
  }

}
