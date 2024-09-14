import { HttpClient } from '@angular/common/http';
import { AuthService } from '../dsajfajf';
import { defer } from 'rxjs';
import { GetTokenResponse, RefreshAccessTokenResponse } from '../AuthResponses';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    environment.googleClientId = 'googleClientID1234';
    environment.googleClientSecret = 'googleClientSecret1234';
    environment.googleRedirectUrl = 'http://localhost:4200/auth/login/callback';
  });

  describe('getAccessToken()', () => {
    it('should return access token given access token was already stored in local storage', () => {
      localStorage.setItem('access_token', 'accessToken123');
      localStorage.setItem('refresh_token', 'refreshToken123');

      const authService = new AuthService(httpClientSpy);

      expect(authService.getAccessToken()).toEqual('accessToken123');
    });

    it('should return empty string if there is nothing in local storage', () => {
      localStorage.clear();
      const authService = new AuthService(httpClientSpy);

      expect(authService.getAccessToken()).toEqual('');
    });

    it('should return the access token given user has went through the entire oauth2 process', (done) => {
      const mockData: GetTokenResponse = {
        access_token: 'accessToken123',
        expires_in: 3600,
        refresh_token: 'refreshToken123',
        scope: 'https://www.googleapis.com/auth/photoslibrary.readonly',
        token_type: 'Bearer',
      };
      httpClientSpy.post.and.returnValue(
        defer(() => Promise.resolve(mockData))
      );

      const authService = new AuthService(httpClientSpy);
      const flow = authService.exchangeCodeWithTokens('123', '123');

      flow.subscribe({
        next: () => {
          expect(authService.getAccessToken()).toEqual('accessToken123');
          done();
        },
        error: done.fail,
      });
    });
  });

  describe('refreshAccessToken()', () => {
    it('should return the new access token and save the new access token and refresh token, given valid refresh token', (done) => {
      localStorage.setItem('access_token', 'oldAccessToken123');
      localStorage.setItem('refresh_token', 'oldRefreshToken123');
      const mockData: RefreshAccessTokenResponse = {
        access_token: 'newAccessToken123',
        expires_in: 3600,
        refresh_token: 'newRefreshToken123',
        token_type: 'Bearer',
      };
      httpClientSpy.post.and.returnValue(
        defer(() => Promise.resolve(mockData))
      );

      const authService = new AuthService(httpClientSpy);
      const flow = authService.refreshAccessToken();

      flow.subscribe({
        next: (accessToken) => {
          expect(accessToken).toEqual('newAccessToken123');
          expect(authService.getAccessToken()).toEqual('newAccessToken123');
          done();
        },
        error: done.fail,
      });
    });
  });

  describe('getLoginRedirectUrl()', () => {
    it('should return correct login redirect uri', () => {
      const authService = new AuthService(httpClientSpy);

      expect(authService.getLoginRedirectUrl().href).toEqual(
        'https://accounts.google.com/o/oauth2/v2/auth?scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fphotoslibrary.readonly&client_id=googleClientID1234&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fauth%2Flogin%2Fcallback&access_type=offline&prompt=consent&response_type=code&state=123'
      );
    });
  });

  describe('exchangeCodeWithTokens()', () => {
    it('should exchange token and save access token and refresh token to local storage given correct params', (done) => {
      const mockData: RefreshAccessTokenResponse = {
        access_token: 'accessToken123',
        expires_in: 3600,
        refresh_token: 'refreshToken123',
        token_type: 'Bearer',
      };
      httpClientSpy.post.and.returnValue(
        defer(() => Promise.resolve(mockData))
      );

      const authService = new AuthService(httpClientSpy);
      const flow = authService.exchangeCodeWithTokens('123', 'code123');

      flow.subscribe({
        next: () => {
          expect(authService.getAccessToken()).toEqual('accessToken123');
          done();
        },
        error: done.fail,
      });
    });

    it('should throw error if state does not match', (done) => {
      const authService = new AuthService(httpClientSpy);
      const flow = authService.exchangeCodeWithTokens(
        'invalidState',
        'code123'
      );

      flow.subscribe({
        next: () => done.fail(),
        error: (err: Error) => {
          expect(err.message).toEqual('Invalid state');
          done();
        },
      });
    });
  });

  describe('logout()', () => {
    it('should make http request and clear access tokens', (done) => {
      httpClientSpy.post.and.returnValue(defer(() => Promise.resolve({})));
      localStorage.setItem('access_token', 'accessToken123');
      localStorage.setItem('refresh_token', 'refreshToken123');

      const authService = new AuthService(httpClientSpy);
      const flow = authService.logout();

      flow.subscribe({
        next: () => {
          expect(authService.getAccessToken()).toEqual('');
          expect(localStorage.getItem('access_token')).toBeNull();
          expect(localStorage.getItem('refresh_token')).toBeNull();
          done();
        },
        error: done.fail,
      });
    });
  });
});
