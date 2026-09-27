import { Router, CanActivateChildFn } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "./shared/services/auth.service";

export const authGuard: CanActivateChildFn = (childRoute, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.getAccessToken()) {
    return true;
  }

  return router.createUrlTree(['/signin'], { queryParams: { returnUrl: state.url } });
};
