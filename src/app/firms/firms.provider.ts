import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { Firm } from '../models/firm';
import { FirmType } from '../models/firmtype';

@Injectable()
export class FirmsProvider {
    public firms: Observable<Firm[]>;
    public firmTypes: Observable<FirmType[]>;

    constructor(public db: AngularFireDatabase) {
        this.firms = db.list<Firm>('/firms').valueChanges();
        this.firmTypes = db.list<FirmType>('/firmtype').valueChanges();
}

}