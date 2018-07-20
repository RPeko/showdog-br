import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Show } from '../models/show';
import { Observable } from 'rxjs';


@Injectable()
export class ShowProvider {
showRef: any;

    constructor(public db: AngularFireDatabase) {
      this.showRef = db.database.ref('/shows/');
    }

    
    upsertShow(show:Show){
        if (!show.key || show.key == '' || show.key == 'undefined'){
            show.key = this.showRef.push().key;
        } 
        const showRef = this.db.object('/shows/' + show.key);
        return showRef.update(show);

    }

}
