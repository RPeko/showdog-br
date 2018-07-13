import { Component, OnInit } from '@angular/core';
import { State } from '../models/state';
import { SettingsProvider } from './settings.provider';
import { Userdata } from '../models/userdata';
import { AuthService } from '../providers/auth';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})

export class SettingsComponent implements OnInit {
  states: State[] = [];


  constructor(public settingsProvider: SettingsProvider, public authService: AuthService) { 
   
  }

  ngOnInit() {
    this.settingsProvider.states.subscribe(states => 
      {
      this.states = states;
      let userdata: Userdata;
      this.authService.getUserdata().on('value', data => {
        userdata = data.val();
        if (userdata && userdata.userstates) {
          for (let i=0; i<this.states.length; i++){
            this.states[i].checked = (userdata.userstates.findIndex(us => us == this.states[i].code) !== -1);
          }
        }
      });
    });
  }
}
