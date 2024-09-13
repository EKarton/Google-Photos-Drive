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
import { MediaItem, MediaItemsPagedResponse } from '../MediaItems';
import { MediaItemsRepositoryService } from '../MediaItemsRepository.service';

describe('MediaItemsRepositoryService', () => {
  const mockResponse1: MediaItemsPagedResponse = {
    mediaItems: [
      {
        id: 'photo1',
        productUrl: 'https://photos.google.com/photos/photo1',
        baseUrl: 'https://photos.google.com/thumbnails/photo1',
      },
      {
        id: 'photo2',
        productUrl: 'https://photos.google.com/photos/photo2',
        baseUrl: 'https://photos.google.com/thumbnails/photo2',
      },
      {
        id: 'photo3',
        productUrl: 'https://photos.google.com/photos/photo3',
        baseUrl: 'https://photos.google.com/thumbnails/photo3',
      },
    ],
    nextPageToken: 'page2',
  };
  const mockResponse2: MediaItemsPagedResponse = {
    mediaItems: [
      {
        id: 'photo4',
        productUrl: 'https://photos.google.com/photos/photo4',
        baseUrl: 'https://photos.google.com/thumbnails/photo4',
      },
      {
        id: 'photo5',
        productUrl: 'https://photos.google.com/photos/photo5',
        baseUrl: 'https://photos.google.com/thumbnails/photo5',
      },
      {
        id: 'photo6',
        productUrl: 'https://photos.google.com/photos/photo6',
        baseUrl: 'https://photos.google.com/thumbnails/photo6',
      },
    ],
    nextPageToken: '',
  };

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
          expect(emittedValues[0]).toEqual(mockResponse1.mediaItems);
          expect(emittedValues[1]).toEqual([
            ...mockResponse1.mediaItems,
            ...mockResponse2.mediaItems,
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
        .flush(mockResponse1, { status: 200, statusText: 'OK' });
      httpMock
        .expectOne(
          (req) =>
            req.url ===
              'https://photoslibrary.googleapis.com/v1/mediaItems:search' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            req.body['pageToken'] === 'page2'
        )
        .flush(mockResponse2, { status: 200, statusText: 'OK' });
    });
  });

  describe('getMediaItemsStream()', () => {
    it('should return a list of media items', (done) => {
      const emittedValues: MediaItem[] = [];
      const expectedMediaItems = [
        ...mockResponse1.mediaItems,
        ...mockResponse2.mediaItems,
      ];
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
        .flush(mockResponse1, { status: 200, statusText: 'OK' });
      httpMock
        .expectOne(
          (req) =>
            req.url ===
              'https://photoslibrary.googleapis.com/v1/mediaItems:search' &&
            req.headers.get('Authorization') === 'Bearer accessToken123' &&
            req.body['pageToken'] === 'page2'
        )
        .flush(mockResponse2, { status: 200, statusText: 'OK' });
    });
  });
});
