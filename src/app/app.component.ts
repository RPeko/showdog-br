import { Component } from '@angular/core';
import { AuthService } from './services/auth';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'Show Dog';

  menuItems = [
    { title: 'Dog Shows', routerLink: 'shows' },
    { title: 'Dog Related Businesses', routerLink: 'firms' },
  ];

  constructor(public authService: AuthService, translate: TranslateService) {
    translate.setDefaultLang('en');
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

