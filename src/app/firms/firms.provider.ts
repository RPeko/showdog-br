import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { Firm } from '../models/firm';
import { FirmType } from '../models/firmtype';

@Injectable()
export class FirmsProvider {
    public firms: Observable<Firm[]>;
    public firmtypes: Observable<FirmType[]>;

    constructor(public db: AngularFireDatabase) {
        this.firms = db.list<Firm>('/firms').valueChanges();
        this.firmtypes = db.list<FirmType>('/firmtype').valueChanges();
}

}