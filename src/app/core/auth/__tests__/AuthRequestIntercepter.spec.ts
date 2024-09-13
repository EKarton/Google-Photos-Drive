import {
  HttpClient,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthRequestIntercepter } from '../AuthRequestIntercepter';
import { AuthService } from '../Auth.service';

describe('AuthRequestIntercepter', () => {
  const url = 'https://photoslibrary.googleapis.com/v1/sharedAlbums';

  let authServiceMock: jasmine.SpyObj<AuthService>;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', [
      'getAccessToken',
      'refreshAccessToken',
    ]);
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthRequestIntercepter,
          multi: true,
        },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch and retry request with new access tokens, given request threw a 401 error', (done) => {
    authServiceMock.refreshAccessToken.and.returnValue(of('newAccessToken123'));
    const headers = { Authorization: 'Bearer accessToken123' };
    const flow = httpClient.get(url, { headers });

    flow.subscribe({
      next: (res) => {
        expect(res).toEqual('OK');
        done();
      },
      error: done.fail,
    });

    httpMock
      .expectOne(
        (req) =>
          req.url === url &&
          req.headers.get('Authorization') === 'Bearer accessToken123'
      )
      .flush('FAILED', { status: 401, statusText: 'FAILED' });
    httpMock
      .expectOne(
        (req) =>
          req.url === url &&
          req.headers.get('Authorization') === 'Bearer newAccessToken123'
      )
      .flush('OK', { status: 200, statusText: 'OK' });
  });

  it('should not retry request, given request did not fail', (done) => {
    const flow = httpClient.get(url);

    flow.subscribe({
      next: () => done.fail(),
      error: () => done(),
    });

    httpMock
      .expectOne(url)
      .flush('Internal server error', { status: 500, statusText: 'FAILED' });
  });

  it('should not retry request, given request succeeded', (done) => {
    const flow = httpClient.get<string>(url);

    flow.subscribe({
      next: (res: string) => {
        expect(res).toEqual('Success');
        done();
      },
      error: done.fail,
    });

    httpMock.expectOne(url).flush('Success', { status: 200, statusText: 'OK' });
  });
});
