import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { Firm } from '../models/firm';

@Injectable()
export class RegistrationProvider {
    public firms: Observable<Firm[]>;

    constructor(public db: AngularFireDatabase) {
        this.firms = db.list<Firm>('/firms').valueChanges();
}
}
