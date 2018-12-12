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
  currentLang = 'ENG';

  menuItems = [
    { title: 'Dog Shows', routerLink: 'shows' },
    { title: 'Dog Related Businesses', routerLink: 'firms' },
  ];

  languages = [{"name":"English", "code": "ENG"}, {"name":"Deutchland", "code": "DEU"} ,{"name":"Srpski", "code": "SRB"}];

  constructor(public authService: AuthService, public translate: TranslateService) {
    translate.setDefaultLang('ENG');
  }

  logout() {
    this.authService.signOut();
  }

  public registrationInfo() {
    if (this.authService.authenticated) {
      return "You have to be logged in if want to register you business.";
    }
  }

  changeLang(lang) {
    this.translate.use(lang);
    this.currentLang = lang;
  }

}

