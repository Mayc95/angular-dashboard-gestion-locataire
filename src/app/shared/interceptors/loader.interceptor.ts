import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../services/loader.service';
import { finalize } from 'rxjs';

export const loaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const router = inject(Router);

  // --- CONFIGURATION : Filtrer les requêtes spécifiques ---
  const isGetUrl = req.method === 'GET';

  if(isGetUrl) {
    loaderService.show();
  }
  return next(req).pipe(
    finalize(() => {
      if(loaderService.isLoading()) {
        loaderService.hide();
      }
    })
  );
};
