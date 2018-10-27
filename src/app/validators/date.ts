import { FormControl } from '@angular/forms';
import * as moment from 'moment';

export class DateValidator {

    static isValid(control: FormControl): any {
        if (!moment(control.value, 'YYYYMMDD').isValid()) {
        return {'bad format': true};
    }
    return null;
}
}