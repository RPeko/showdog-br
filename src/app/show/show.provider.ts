import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Show } from '../models/show';
import { Observable } from 'rxjs';
import { ShowLevel } from '../models/showLevel';
import { Country } from '../models/country';


@Injectable()
export class ShowProvider {
    public showRef: any;
    public showLevels: Observable<ShowLevel[]>;
    public countries: Observable<Country[]>;

    constructor(public db: AngularFireDatabase) {
        this.showRef = db.database.ref('/shows/');
        this.showLevels = db.list<ShowLevel>('/showlevel').valueChanges();
        this.countries = db.list<Country>('/countries', ref => ref.orderByChild('name')).valueChanges();

    }

    upsertShow(show: Show){
        if (!show.key || show.key === '' || show.key === 'undefined') {
            show.key = this.showRef.push().key; }
        const showObj = this.db.object('/shows/' + show.key);
        return showObj.update(show);
    }

}
