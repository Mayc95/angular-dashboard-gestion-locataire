import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginCredentials, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly #http = inject(HttpClient);
  readonly #accessTokenKey = 'access_token';
  readonly #refreshTokenKey = 'refresh_token';
  readonly #accessToken = signal<string | null>(this.readValidAccessToken());

  /** True when a non-expired access token is available. */
  readonly isLoggedIn = computed(() => this.#accessToken() !== null);

  /**
   * Sends credentials to the API and persists the returned JWT.
   * The API response can expose its access token as `accessToken`, `token` or `jwt`.
   */
  signin(credentials: LoginCredentials): Observable<void> {
    return this.#http
      .post<LoginResponse>(`${environment.apiUrl}${environment.authLoginPath}`, credentials)
      .pipe(
        tap((response) => this.storeTokens(response.token!)),
        // The component only needs to know that authentication succeeded.
        map(() => undefined),
      );
  }

  /** Returns an access token only if it has not expired. */
  getAccessToken(): string | null {
    const token = this.#accessToken();
    if (!token || this.isTokenExpired(token)) {
      this.signout();
      return null;
    }

    return token;
  }

  /** Removes all client-side credentials. */
  signout(): void {
    localStorage.removeItem(this.#accessTokenKey);
    localStorage.removeItem(this.#refreshTokenKey);
    this.#accessToken.set(null);
  }

  private storeTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(this.#accessTokenKey, accessToken);
    if (refreshToken) {
      localStorage.setItem(this.#refreshTokenKey, refreshToken);
    }
    this.#accessToken.set(accessToken);
  }

  private readValidAccessToken(): string | null {
    const token = localStorage.getItem(this.#accessTokenKey);
    if (!token || this.isTokenExpired(token)) {
      localStorage.removeItem(this.#accessTokenKey);
      return null;
    }

    return token;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payloadPart = token.split('.')[1];
      if (!payloadPart) {
        return true;
      }

      const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/');
      const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
      const json = new TextDecoder().decode(
        Uint8Array.from(atob(paddedBase64), (character) => character.charCodeAt(0)),
      );
      const payload = JSON.parse(json) as { exp?: unknown };

      return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
    } catch {
      // A malformed token must never grant access.
      return true;
    }
  }

}
