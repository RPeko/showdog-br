import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { Firm } from '../models/firm';
import { FirmType } from '../models/firmtype';

@Injectable()
export class RegistrationProvider {
    public firms: Observable<Firm[]>;
    public firmtypes: Observable<FirmType[]>;
    firmRef: any;

    constructor(public db: AngularFireDatabase) {
        this.firms = db.list<Firm>('/firms').valueChanges();
        this.firmtypes = db.list<FirmType>('/firmtype').valueChanges();
        this.firmRef = db.database.ref('/firms/');
}


public upsertFirm(firm: Firm){
    if (!firm.key || firm.key == '' || firm.key == 'undefined'){
        firm.key = this.firmRef.push().key;
    } 
    const firmObj = this.db.object('/firms/' + firm.key);
    return firmObj.update(firm);
}

}