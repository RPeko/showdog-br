import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Show } from '../models/show';
import { Observable } from 'rxjs';
import { ShowLevel } from '../models/showLevel';


@Injectable()
export class ShowProvider {
    public showRef: any;
    public showLevels: Observable<ShowLevel[]>;

    constructor(public db: AngularFireDatabase) {
        this.showRef = db.database.ref('/shows/');
        this.showLevels = db.list<ShowLevel>('/showlevel').valueChanges();
    }

    upsertShow(show: Show){
        if (!show.key || show.key === '' || show.key === 'undefined') {
            show.key = this.showRef.push().key; }

        const showObj = this.db.object('/shows/' + show.key);
        return showObj.update(show);

    }

}
