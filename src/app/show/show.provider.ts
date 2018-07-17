import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Show } from '../models/show';

@Injectable()
export class ShowProvider {
show: Show;

    constructor(public db: AngularFireDatabase) {
       
    }


}
