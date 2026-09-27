
import { Component, inject, signal } from '@angular/core';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs';
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
  readonly route = inject(ActivatedRoute);

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
    this.showError.set(false);
    this.showLoading.set(true);
    this.authService.signin({ username: this.username, password: this.password })
      .pipe(finalize(() => this.showLoading.set(false)))
      .subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        void this.router.navigateByUrl(returnUrl?.startsWith('/') ? returnUrl : '/appartements');
      },
      error: () => {
        this.showError.set(true);
      }
    });
  }
}
