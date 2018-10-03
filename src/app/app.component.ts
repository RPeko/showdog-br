import { Component } from '@angular/core';
import { Router } from '../../node_modules/@angular/router';

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
               {title: 'Login',  routerLink: 'login'}
              ];

              constructor(
                private router: Router
              ) {
              }
}
