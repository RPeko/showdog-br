import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { AppComponent } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { ShowsComponent } from './shows/shows.component';
import { AppRoutingModule } from './app-routing.module';
import { ShowsProvider } from './shows/shows.provider';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from './services/auth';
import { LoginComponent } from './login/login.component';

import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule, MatSelectModule } from '@angular/material';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';

import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowComponent } from './show/show.component';
import { ShowProvider } from './show/show.provider';
import { RegistrationComponent } from './registration/registration.component';
import { RegistrationProvider } from './registration/registration.provider';
import { FirmsComponent } from './firms/firms.component';
import { FirmsProvider } from './firms/firms.provider';
import { AppProvider } from './app.provider';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ShowsComponent,
    ShowComponent,
    LoginComponent,
    ShowComponent,
    RegistrationComponent,
    FirmsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapConfig.apiKey
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule,
    MatSliderModule
  ],
  providers: [
    ShowsProvider,
    ShowProvider,
    AppProvider,
    RegistrationProvider,
    FirmsProvider,
    AuthService,
    AngularFireAuth,
    AngularFireDatabase,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
