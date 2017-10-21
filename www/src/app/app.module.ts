// Main
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { MomentModule } from 'angular2-moment';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

// Directives
import { AlertComponent } from './_directives/index';
import { PersonContactComponent } from './_directives/index';

import { AuthGuard } from './_guards/index';
import {
  VoootPersonService,
  VoootOrganizationService,
  VoootMembershipService,
  AlertService,
  AuthService,
  LoadingService } from './_services/index';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import {
  PersonListComponent,
  PersonDetailComponent,
  PersonEditComponent,
  PersonCreateComponent } from './person/index';

// organization
import {
  OrganizationListComponent,
  OrganizationDetailComponent,
  OrganizationEditComponent,
  OrganizationCreateComponent } from './organization/index';

// Static pages
import { PageComponent } from './pages/page.component';
import { ClaimComponent } from './pages/claim/claim.component';
import { VertegenwoordigersComponent } from './pages/vertegenwoordigers/vertegenwoordigers.component';
import { OverheidComponent } from './pages/overheid/overheid.component';
import { BewonersComponent } from './pages/bewoners/bewoners.component';
import { OrganisatiesComponent } from './pages/organisaties/organisaties.component';

import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { BrandAssetsComponent } from './pages/brand-assets/brand-assets.component';

import { FaqComponent } from './pages/faq/faq.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';

import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { AccountComponent } from './account/account.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    HttpModule,
    NgbModule.forRoot(),
    MomentModule
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    PersonContactComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    PersonListComponent,
    PersonDetailComponent,
    PersonEditComponent,
    PersonCreateComponent,
    OrganizationListComponent,
    OrganizationDetailComponent,
    OrganizationEditComponent,
    OrganizationCreateComponent,

    NavComponent,
    FooterComponent,
    AccountComponent,

    PageComponent,
    ClaimComponent,
    VertegenwoordigersComponent,
    OverheidComponent,
    BewonersComponent,
    OrganisatiesComponent,
    AboutComponent,
    ContactComponent,
    BrandAssetsComponent,

    FaqComponent,
    TermsComponent,
    PrivacyComponent,

  ],
  providers: [
    AuthGuard,
    AlertService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    AuthService,
    VoootPersonService,
    VoootOrganizationService,
    VoootMembershipService,
    LoadingService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
