import { Component, OnInit } from '@angular/core';
import { Show } from '../models/show';
import { Userdata } from '../models/userdata';
import { AuthService } from '../providers/auth';
import { DataProvider } from '../providers/data';
import { ShowsProvider } from './shows.provider';


@Component({
  selector: 'app-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css']
})

export class ShowsComponent implements OnInit {
  stateshows: { state: string, shows: Show[] }[];
  monthshows: { month: string, shows: Show[] }[];
  admin = 0;

  constructor(
    public dataProvider: DataProvider,
    public showsProvider: ShowsProvider,
    public authService: AuthService
  ) {
  }

  ngOnInit(){
    this.authService.getUserdata().on('value', data => {
      let userdata: Userdata;
      this.stateshows = [];
      this.monthshows = [];
      userdata = data.val();
      console.log("data.val: " + JSON.stringify(userdata));

      this.showsProvider.shows.subscribe(shows => this.processShows(shows));
      if (userdata) {
        console.log("userdata.userstates: " + userdata.userstates);
        if (!userdata.admin) {
          this.admin = userdata.admin;
        }
        if (userdata.userstates){
          userdata.userstates.forEach(userstate => {
            console.log("userstate: " + userstate);
            this.showsProvider.statecode.next(userstate);   
          });
        }
      } else { 
        this.showsProvider.statecode.next("svedrzave");
      }
    });
  }

  processShows(shows:Show[]){
    console.log("shows to process: " + JSON.stringify(shows));
    for (let i = 0; i < shows.length; i++){
      this.groupByState(shows[i]);
      this.groupByMonth(shows[i]);
    }
  }

  groupByState(show:Show){
    let index = this.stateshows.findIndex(ss => ss.state == show.statecode);
    if (index > -1){
      this.stateshows[index].shows.push(show);
    } else {
      this.stateshows.push({state: show.statecode, shows: [show]});
    }
  }

  groupByMonth(show:Show){
    let index = this.monthshows.findIndex(ms => ms.month == show.date.slice(0, 7));
    if (index > -1){
      this.monthshows[index].shows.push(show);
    } else {
      this.monthshows.push({month: show.date.slice(0, 7), shows: [show]});
    }
  }

  open(show:Show){
    // this.navCtrl.setRoot("ShowPage", {show:show});
  }
}
