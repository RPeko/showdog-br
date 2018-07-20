import { FormControl } from '@angular/forms';
 
export class LonValidator {
 
    static isValid(control: FormControl): any {
 
        if(isNaN(control.value)){
            return {
                "not a number": true
            };
        }
 
 
        if ((control.value < -180) || (control.value > 180)){
            return {
                "not realistic": true
            };
        }
 
        return null;
    }
 
}