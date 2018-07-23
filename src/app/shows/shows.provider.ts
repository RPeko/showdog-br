import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';
import { Show } from '../models/show';

@Injectable()
export class ShowsProvider {
    public shows: Observable<Show[]>;
    public statecode = new Subject<string>();

    constructor(public db: AngularFireDatabase) {
        // this.statecode.subscribe(sc => console.log("sc: " + sc));

          this.shows = this.statecode.pipe(
            mergeMap(sc =>
                {return db.list<Show>('/shows', ref => sc ? ref.orderByChild("statecode").equalTo(sc) : ref).valueChanges()}
            )
          );
    }

}