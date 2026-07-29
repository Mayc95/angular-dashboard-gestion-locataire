import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class FormfieldsValidationService {

  check(condition: boolean, message: string): string | null {
    return condition ? message : null;
  }

  validateEmail(email:string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }


}
