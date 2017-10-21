import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { PersonListComponent } from './person/index';
import { PersonDetailComponent } from './person/index';
import { PersonEditComponent } from './person/index';
import { PersonCreateComponent } from './person/index';

import {
  OrganizationListComponent,
  OrganizationDetailComponent,
  OrganizationEditComponent,
  OrganizationCreateComponent } from './organization/index';

import { AccountComponent } from './account/account.component';

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

import { AuthGuard } from './_guards/index';

const appRoutes: Routes = [

  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },

  { path: 'vertegenwoordigers', component: VertegenwoordigersComponent, canActivate: [AuthGuard] },
  { path: 'overheid', component: OverheidComponent, canActivate: [AuthGuard] },
  { path: 'bewoners', component: BewonersComponent, canActivate: [AuthGuard] },
  { path: 'organisaties', component: OrganisatiesComponent, canActivate: [AuthGuard] },

  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: 'brand-assets', component: BrandAssetsComponent, canActivate: [AuthGuard] },

  { path: 'faq', component: FaqComponent, canActivate: [AuthGuard] },
  { path: 'terms', component: TermsComponent, canActivate: [AuthGuard] },
  { path: 'privacy', component: PrivacyComponent, canActivate: [AuthGuard] },

  { path: 'claim', component: HomeComponent, canActivate: [AuthGuard] },


  { path: 'person', component: PersonListComponent, canActivate: [AuthGuard] },
  { path: 'person/create', component: PersonCreateComponent, canActivate: [AuthGuard] },
  { path: 'person/:id', component: PersonDetailComponent, canActivate: [AuthGuard] },
  { path: 'person/:id/edit', component: PersonEditComponent, canActivate: [AuthGuard] },

  { path: 'gemeente', component: OrganizationListComponent, canActivate: [AuthGuard] },
  { path: 'gemeente/create', component: OrganizationCreateComponent, canActivate: [AuthGuard] },
  { path: 'gemeente/:id', component: OrganizationDetailComponent, canActivate: [AuthGuard] },
  { path: 'gemeente/:id/edit', component: OrganizationEditComponent, canActivate: [AuthGuard] },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
