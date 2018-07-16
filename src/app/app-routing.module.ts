import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { ShowsComponent }       from './shows/shows.component';
import { LoginComponent } from './login/login.component';
import { SettingsComponent } from './settings/settings.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'shows', component: ShowsComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
