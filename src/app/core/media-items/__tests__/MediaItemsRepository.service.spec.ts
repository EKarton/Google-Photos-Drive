import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MediaItemsRequestService } from '../MediaItemsRequest.service';
import { MediaItem } from '../MediaItems';
import { MediaItemsRepositoryService } from '../MediaItemsRepository.service';
import { page1, page2 } from './MockMediaItemsPagedResponses';

describe('MediaItemsRepositoryService', () => {
  let httpMock: HttpTestingController;
  let service: MediaItemsRepositoryService;

  beforeEach(() => {
    localStorage.setItem('access_token', 'accessToken123');
    localStorage.setItem('refresh_token', 'refreshToken123');

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        MediaItemsRequestService,
        MediaItemsRepositoryService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(MediaItemsRepositoryService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getMediaItems()', () => {
    it('should return a list of media items', (done) => {
      const emittedValues: MediaItem[][] = [];
      service.getMediaItems().subscribe({
        next: (val: MediaItem[]) => emittedValues.push(val),
        error: done.fail,
        complete: () => {
          expect(emittedValues[0]).toEqual(page1.mediaItems);
          expect(emittedValues[1]).toEqual([
            ...page1.mediaItems,
            ...page2.mediaItems,
          ]);
          done();
        },
      });

      httpMock
        .expectOne(
          (req) =>
            req.url ===
              'https://photoslibrary.googleapis.com/v1/mediaItems:search' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            req.body['pageToken'] === undefined
        )
        .flush(page1, { status: 200, statusText: 'OK' });
      httpMock
        .expectOne(
          (req) =>
            req.url ===
              'https://photoslibrary.googleapis.com/v1/mediaItems:search' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            req.body['pageToken'] === page1.nextPageToken
        )
        .flush(page2, { status: 200, statusText: 'OK' });
    });
  });

  describe('getMediaItemsStream()', () => {
    it('should return a list of media items', (done) => {
      const emittedValues: MediaItem[] = [];
      const expectedMediaItems = [...page1.mediaItems, ...page2.mediaItems];
      service.getMediaItemsStream().subscribe({
        next: (val: MediaItem) => emittedValues.push(val),
        error: done.fail,
        complete: () => {
          expect(emittedValues.length).toEqual(6);
          expect(new Set(emittedValues)).toEqual(new Set(expectedMediaItems));
          done();
        },
      });

      httpMock
        .expectOne(
          (req) =>
            req.url ===
              'https://photoslibrary.googleapis.com/v1/mediaItems:search' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            req.body['pageToken'] === undefined
        )
        .flush(page1, { status: 200, statusText: 'OK' });
      httpMock
        .expectOne(
          (req) =>
            req.url ===
              'https://photoslibrary.googleapis.com/v1/mediaItems:search' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            req.body['pageToken'] === page1.nextPageToken
        )
        .flush(page2, { status: 200, statusText: 'OK' });
    });
  });
});
