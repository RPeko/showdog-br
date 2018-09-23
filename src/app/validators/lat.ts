import { FormControl } from '@angular/forms';

export class LatValidator {

    static isValid(control: FormControl): any {

        if (isNaN(control.value)) {
            return {
                'not a number': true
            };
        }


        if ((control.value < -90) || (control.value > 90)) {
            return {
                'not realistic': true
            };
        }

        return null;
    }

}
