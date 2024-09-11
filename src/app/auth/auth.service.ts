import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private state: string;

  private scopes = ['https://www.googleapis.com/auth/photoslibrary.readonly'];
  private clientId = import.meta.env.NG_APP_GOOGLE_CLIENT_ID;
  private clientSecret = import.meta.env.NG_APP_GOOGLE_CLIENT_SECRET;
  private redirectUri = import.meta.env.NG_APP_GOOGLE_REDIRECT_URL;

  private accessToken: string | undefined;
  private refreshToken: string | undefined;

  constructor(private http: HttpClient) {
    this.state = '123';
  }

  getAccessToken(): string | undefined {
    return this.accessToken;
  }

  refreshAccessToken() {
    const url = new URL('https://www.googleapis.com/oauth2/v4/token');
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
    };
    return this.http.post(url.href, body).pipe(
      map((response: any) => {
        this.accessToken = response['access_token'];
        return response['access_token'];
      })
    );
  }

  async refreshAccessTokenAsync() {
    const url = new URL('https://www.googleapis.com/oauth2/v4/token');
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: this.refreshToken,
      grant_type: 'refresh_token',
    };
    const response = await firstValueFrom(this.http.post(url.href, body));

    this.accessToken = (response as any).accessToken;
  }

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

  async exchangeCodeWithTokens(state: string, code: string) {
    if (state !== this.state) {
      throw new Error('Invalid state');
    }

    const url = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams();
    params.set('code', code);
    params.set('client_id', this.clientId);
    params.set('client_secret', this.clientSecret);
    params.set('redirect_uri', this.redirectUri);
    params.set('grant_type', 'authorization_code');

    const response = await firstValueFrom(
      this.http.post(url, params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    );

    this.accessToken = (response as any)['access_token'];
    this.refreshToken = (response as any)['refresh_token'];
  }
}
