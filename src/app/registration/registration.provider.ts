import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { Firm } from '../models/firm';
import { FirmType } from '../models/firmtype';
import { State } from '../models/state';
import { AuthService } from '../services/auth';

@Injectable()
export class RegistrationProvider {
    public firms: Observable<Firm[]>;
    public firmtypes: Observable<FirmType[]>;
    public states: Observable<State[]>;
    firmRef: any;

    constructor(public db: AngularFireDatabase, private authService: AuthService) {
        this.firms = db.list<Firm>('/firms', ref => ref.orderByChild('userId').equalTo(this.authService.getUid())).valueChanges();
        this.firmtypes = db.list<FirmType>('/firmtype').valueChanges();
        this.states = db.list<State>('/states').valueChanges();
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