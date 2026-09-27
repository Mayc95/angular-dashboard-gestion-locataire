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
