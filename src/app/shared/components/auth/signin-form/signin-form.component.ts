
import { Component, inject, signal } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { delay, catchError } from 'rxjs';
import { AlertComponent } from "../../ui/alert/alert.component";

@Component({
  selector: 'app-signin-form',
  imports: [
    LabelComponent,
    //CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
    AlertComponent
],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {

  readonly authService = inject(AuthService);
  readonly router = inject(Router);

  showLoading = signal(false);
  showError = signal(false);

  showPassword = false;
  isChecked = false;

  username = '';
  password = '';

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    console.log('Remember Me:', this.isChecked);

    this.showError.set(false);
    this.showLoading.set(true);
    this.authService.signin(this.username, this.password).subscribe({
      next: (isLoggedIn) => {
        this.showLoading.set(false);
        if (isLoggedIn) {
          delay(2000);
          this.router.navigate(['/appartements']);
        } else {
          this.showError.set(true);
        }
      },
      error: (error) => {
        this.showError.set(true);
        console.log("Erreur lors de la connexion: ");
        console.log(error);
      },
      complete: () => this.showLoading.set(false)
    })
  }
}
