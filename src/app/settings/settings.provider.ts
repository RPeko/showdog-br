import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { State } from '../models/state';

@Injectable()
export class SettingsProvider {
    public states: Observable<State[]>;

    constructor(public db: AngularFireDatabase) {
        this.states = db.list<State>('/states').valueChanges();
}
}
