import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { PaiementsService } from './shared/services/paiements.service';
import { environment } from '../environments/environment.development';
import { PaiementsJsonServerService } from './shared/services/json-server/paiements-json-server.service';
import { PaiementsFirebaseCloudstoreService } from './shared/services/firebase-cloudstore/paiements-firebase-cloudstore.service';
import { LocatairesService } from './shared/services/locataires.service';
import { LocatairesFirebaseCloudstoreService } from './shared/services/firebase-cloudstore/locataires-firebase-cloudstore.service';
import { LocatairesJsonServerService } from './shared/services/json-server/locataires-json-server.service';

export function paiementsServiceFactory(): PaiementsService {
  return new PaiementsFirebaseCloudstoreService();
}
export function locatairesServiceFactory(): LocatairesService {
  return new LocatairesFirebaseCloudstoreService();
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
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
