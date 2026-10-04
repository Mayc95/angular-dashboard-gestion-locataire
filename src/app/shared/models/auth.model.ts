export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * The API may return either `accessToken` (recommended) or `token`.
 */
export interface LoginResponse {
  accessToken?: string;
  token?: string;
  jwt?: string;
  refreshToken?: string;
}

export interface AuthenticatedUserDetails {
  username: string;
  email: string;
  authenticated: boolean;
  authorities: [];
}
