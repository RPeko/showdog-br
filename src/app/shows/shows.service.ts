import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Show } from '../models/show';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class ShowsProvider {
    public shows: Observable<any[]>;
    public statecode = new Subject<string>();

    constructor(public db: AngularFireDatabase) {
        this.statecode.subscribe(sc => console.log("sc: " + sc));
        this.shows = this.statecode.pipe(
            switchMap(statecode => {
                if (statecode == 'svedrzave'){
                    return db.list('/shows').valueChanges();
                } else {
                    return db.list('/shows', ref => ref.orderByChild("statecode").equalTo(statecode)).valueChanges();
                }
            }
        
             
            )
          );
        // this.shows = db.list('/shows/', ref => ref.orderByChild("/statecode/").equalTo("SRB")).valueChanges();
    }

    // upsetShow(show:Show){
    //     if (!show.key || show.key == '' || show.key == 'undefined'){
    //         show.key = this.shows.push().key;
    //     } 
    //     const showRef = this.db.object('/shows/' + show.key);
    //     return showRef.update(show);

    // }

    // snapshotToArray(snapshot) {
    //     var returnArr = [];
    
    //     snapshot.forEach(function(childSnapshot) {
    //         var item = childSnapshot.val();
    //         item.key = childSnapshot.key;
    
    //         returnArr.push(item);
    //     });
    
    //     return returnArr;
    // };
    

}
