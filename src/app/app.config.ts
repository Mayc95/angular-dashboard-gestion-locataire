import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { PaiementsService } from './shared/services/paiements.service';
import { LocatairesService } from './shared/services/locataire.service';
import { AppartementService } from './shared/services/appartement.service';
import { AppartementApiService } from './shared/services/api/appartement-api.service';
import { LocataireApiService } from './shared/services/api/locataire-api.service';
import { PaiementApiService } from './shared/services/api/paiement-api.service';
import { jwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

export function paiementsServiceFactory(): PaiementsService {
  return new PaiementApiService();
}
export function locatairesServiceFactory(): LocatairesService {
  return new LocataireApiService();
}
export function appartementsServiceFactory(): AppartementService {
  return new AppartementApiService();
}

// Enregistre les règles de formatage francophones
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    // Définit le français par défaut
    { provide: LOCALE_ID, useValue: 'fr' }, 
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    {
      provide: AppartementService,
      useFactory: appartementsServiceFactory
    },
    {
      provide: PaiementsService,
      useFactory: paiementsServiceFactory
    },
    {
      provide: LocatairesService,
      useFactory: locatairesServiceFactory
    },
  ]
};
