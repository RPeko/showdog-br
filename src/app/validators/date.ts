import { FormControl } from '@angular/forms';
// import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';

export class DateValidator {

    static isValid(control: FormControl): any {
        if (moment(control.value, 'YYYYMMDD').isValid()) {
        return true;
    }
    return null;
}
}

// export function DateValidator(control: AbstractControl) {
//     if (moment(control.value, 'YYYYMMDD').isValid()){
//       return { validDate: true };}
//     return null;
//   }

