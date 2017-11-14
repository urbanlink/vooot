import { NgModule,APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { MomentModule } from 'angular2-moment';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { AppRoutingModule } from './app.routing';

import { CoreModule } from './core/core.module';
import { UiModule } from './ui/ui.module';
import { UserModule } from './user/user.module';

import { AuthService } from './core/auth.service';

// Custom modules
import { GetStreamModule } from './getstream/getstream.module';

// Directives
import { AlertComponent } from './_directives/index';
import { PersonContactComponent } from './_directives/index';

import {
  VoootPersonService,
  VoootOrganizationService,
  VoootMembershipService,
  AlertService,
  LoadingService } from './_services/index';

import { HomeComponent } from './home/home.component';

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

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    NgbModule.forRoot(),
    MomentModule,
    CoreModule,
    UiModule,
    UserModule,
    GetStreamModule
  ],
  declarations: [
    AppComponent,
    AlertComponent,
    PersonContactComponent,
    HomeComponent,
    PersonListComponent,
    PersonDetailComponent,
    PersonEditComponent,
    PersonCreateComponent,
    OrganizationListComponent,
    OrganizationDetailComponent,
    OrganizationEditComponent,
    OrganizationCreateComponent,

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
    AlertService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    VoootPersonService,
    VoootOrganizationService,
    VoootMembershipService,
    LoadingService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
