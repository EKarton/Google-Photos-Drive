export interface GetTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface RefreshAccessTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}
