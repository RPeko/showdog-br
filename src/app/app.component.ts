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
              ];

              constructor(public authService: AuthService) {
              }
              logout() {
                this.authService.signOut();
              }
    public registrationInfo() {
      if (this.authService.authenticated) {
        return "You have to be logged in if want to register you business.";
      }
    }
  
  }

