import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, throwError } from 'rxjs';
import { GetTokenResponse, RefreshAccessTokenResponse } from './AuthResponses';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private scopes = ['https://www.googleapis.com/auth/photoslibrary.readonly'];
  private clientId = import.meta.env.NG_APP_GOOGLE_CLIENT_ID;
  private clientSecret = import.meta.env.NG_APP_GOOGLE_CLIENT_SECRET;
  private redirectUri = import.meta.env.NG_APP_GOOGLE_REDIRECT_URL;

  private state: string;
  private accessToken: string;
  private refreshToken: string;

  constructor(private httpClient: HttpClient) {
    this.state = '123';
    this.accessToken = localStorage.getItem('access_token') || '';
    this.refreshToken = localStorage.getItem('refresh_token') || '';
  }

  /** Get the access token. */
  getAccessToken(): string {
    return this.accessToken;
  }

  /** Refresh the access token. */
  refreshAccessToken(): Observable<string> {
    const url = new URL('https://www.googleapis.com/oauth2/v4/token');
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
    };

    return this.httpClient
      .post<RefreshAccessTokenResponse>(url.href, body)
      .pipe(
        map((res) => {
          this.accessToken = res.access_token;
          localStorage.setItem('access_token', this.accessToken);
          return res.access_token;
        })
      );
  }

  /** Get the url to log into Google.  */
  getLoginRedirectUrl(): URL {
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.append('scope', this.scopes.join(' '));
    url.searchParams.append('client_id', this.clientId);
    url.searchParams.append('redirect_uri', this.redirectUri);
    url.searchParams.append('access_type', 'offline');
    url.searchParams.append('prompt', 'consent');
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('state', this.state);

    return url;
  }

  /** Exchanges the code and state with the access token */
  exchangeCodeWithTokens(state: string, code: string) {
    if (state !== this.state) {
      return throwError(() => new Error('Invalid state'));
    }

    const url = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams();
    params.set('code', code);
    params.set('client_id', this.clientId);
    params.set('client_secret', this.clientSecret);
    params.set('redirect_uri', this.redirectUri);
    params.set('grant_type', 'authorization_code');

    const options = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    return this.httpClient
      .post<GetTokenResponse>(url, params.toString(), options)
      .pipe(
        map((res) => {
          this.accessToken = res.access_token;
          this.refreshToken = res.refresh_token;

          localStorage.setItem('access_token', this.accessToken);
          localStorage.setItem('refresh_token', this.refreshToken);
        })
      );
  }

  /** Revokes the access token */
  logout(): Observable<object> {
    const url = 'https://accounts.google.com/o/oauth2/revoke';
    const body = { token: this.accessToken };

    this.accessToken = '';
    this.refreshToken = '';
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    return this.httpClient.post(url, body);
  }
}
