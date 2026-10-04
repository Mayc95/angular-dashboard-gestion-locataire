import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

/** Adds the bearer token only to calls made to this application's API. */
export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getAccessToken();
  const isApiRequest = request.url.startsWith(environment.apiUrl);

  const authenticatedRequest = token && isApiRequest
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authenticatedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && isApiRequest) {
        authService.signout();
        //router.navigate(['/signin']);
        //Pour retourner l'user sur la page de login avec l'url d'ou il vient en parametre
        //void router.navigate(['/signin'], { queryParams: { returnUrl: router.url } });
        void router.navigate(['/signin'], { queryParams: { error: "auth" } });
      }

      return throwError(() => error);
    }),
  );
};
