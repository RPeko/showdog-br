import { Component } from '@angular/core';
import { AuthService } from './services/auth';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { TranslateService } from '@ngx-translate/core';
import { AppProvider } from './app.provider';
import { Language } from './models/language';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'Show Dog';

  menuItems = [
    { title: 'Dog shows', routerLink: 'shows' },
    { title: 'Dog Related Businesses', routerLink: 'firms' },
  ];

  languages: Language[] = [];
  currentLang = 'ENG';

  constructor(public authService: AuthService,
              public translate: TranslateService,
              public appProvider: AppProvider,
              protected localStorage: LocalStorage) {

    translate.setDefaultLang('ENG');
    localStorage.getItem('lang').subscribe(lang => {
      if (lang) {
        this.currentLang = lang;
        translate.use(lang);
      }
     });
     appProvider.languages.subscribe(langs => this.languages = langs);
  }

  logout() {
    this.authService.signOut();
  }

  public registrationInfo() {
    if (this.authService.authenticated) {
      return 'You have to be logged in if want to register you business.';
    }
  }


  changeLang(lang: string) {
    console.log(lang);
    this. translate.use(lang);
    this.localStorage.setItem('lang', lang).subscribe(() => {});
  }

}

