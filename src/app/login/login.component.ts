import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {
  

  constructor(public authService: AuthService, private router: Router, private ngZone: NgZone) { }

  loginWithGoogle() {
    this.authService.signInWithGoogle().then(u => {
      this.ngZone.run(() => this.router.navigate(['/shows']));
      
      // console.log("u:  " + JSON.stringify(u));
    } );
  }

  loginWithFB() {
    this.authService.signInWithFB().then(u =>  this.router.navigate(['/shows']));
  }

  loginAsGuest(){
    this.authService.signInAnonymously().then(u => {
      this.router.navigate(['/shows']);
      // console.log("anonimus: " + JSON.stringify(u));
    });
  }

  logout() {
    this.authService.signOut();
  }

}
