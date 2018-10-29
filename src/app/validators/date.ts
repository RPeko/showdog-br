import { FormControl } from '@angular/forms';
import * as moment from 'moment';

export class DateValidator {

    static isValid(control: FormControl): any {
        const d = moment(control.value, 'YYYYMMDD');
        if (!d.isValid()) {
            return {'invalid format': true};
        } else {
            if (d.year() < 2018 || d.year() > 2040) {
                return {'invalid year': true};
            }
        }
    return null;
}
}