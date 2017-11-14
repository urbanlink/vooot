import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule }   from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    AccountComponent,
    LoginComponent,
    RegisterComponent
  ],
  exports: [
    AccountComponent,
    LoginComponent,
    RegisterComponent
  ]
})
export class UserModule { }
