import { Router, CanActivateChildFn } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "./shared/services/auth.service";

export const authGuard: CanActivateChildFn = (childRoute, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/signin');
  
};
