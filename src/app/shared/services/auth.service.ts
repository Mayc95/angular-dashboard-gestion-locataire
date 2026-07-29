import { Injectable, signal } from "@angular/core";
import { delay, Observable, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AuthService {

   readonly #isLoggedIn = signal(false);
   readonly isLoggedIn = this.#isLoggedIn.asReadonly();


   signin(username:string, password:string):Observable<boolean> {
    const isLoggedIn = (username == 'admin' && password == 'admin');
    this.#isLoggedIn.set(isLoggedIn);
    return of(isLoggedIn).pipe(delay(3000));
   }

   signout() {
    this.#isLoggedIn.set(false);
   }

}
