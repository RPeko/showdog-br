import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { ShowsComponent }       from './shows/shows.component';
import { LoginComponent } from './login/login.component';
import { ShowComponent } from './show/show.component';
import { RegistrationComponent } from './registration/registration.component';
import { FirmsComponent } from './firms/firms.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'show', component: ShowComponent },
  { path: 'shows', component: ShowsComponent },
  { path: 'firms', component: FirmsComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
