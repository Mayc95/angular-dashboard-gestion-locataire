
import { AfterViewInit, Component, inject, signal } from '@angular/core';
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
export class SigninFormComponent implements AfterViewInit {

  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly urlError = this.route.snapshot.queryParamMap.get('error');

  showLoading = signal(false);
  showError = signal(false);

  showPassword = false;
  isChecked = false;

  username = '';
  password = '';

  ngAfterViewInit(): void {
    if (this.urlError === 'auth') {
      console.error("Erreur d'authentification : utilisateur non authentifié ou session expirée. Vérifier UserDetailsService au niveau de l'API, les différents Claims utilisés pour générer le JWT, le JWTAUthenticationFilter et aussi la methode utilisée par UserDetailsService pour récupérer l'utilisateur (loadUserByUsername) et la methode utilisée pour générer le JWT (generateToken).");
      this.showError.set(true);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    this.showError.set(false);
    this.showLoading.set(true);
    this.authService.signin({ username: this.username, password: this.password })
      .pipe(finalize(() => this.showLoading.set(false)))
      .subscribe({
        next: (response) => {
          //const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.showError.set(true);
        }
      });
  }
}
