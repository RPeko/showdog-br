import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { Language } from './models/language';

@Injectable()
export class AppProvider {
    public languages: Observable<Language[]>;

    constructor(public db: AngularFireDatabase) {
          this.languages = db.list<Language>('/languages', ref => ref.orderByChild('order')).valueChanges();
    }
}
