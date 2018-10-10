import { Component } from '@angular/core';
import { Router } from '../../node_modules/@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'Show Dog';

  menuItems = [
               {title: 'Dog Shows',  routerLink: 'shows'},
               {title: 'Dog Related Businesses',  routerLink: 'firms'},
               {title: 'Register your bussiness',  routerLink: 'registration'},
              ];

              constructor(public authService: AuthService) {
              }
              logout() {
                this.authService.signOut();
              }
            }
