import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'Show Dog';
  menuItems = [
               {title:"Shows",  routerLink:"shows"},
               {title:"Register your bussiness",  routerLink:"registration"},
               {title:"Settings",  routerLink:"settings"},
               {title:"Login",  routerLink:"login"}
              ]

}
