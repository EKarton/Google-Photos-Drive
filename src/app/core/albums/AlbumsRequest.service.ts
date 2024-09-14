import { Injectable } from '@angular/core';
import { AuthService } from '../auth/dsajfajf';
import { HttpClient } from '@angular/common/http';
import { EMPTY, expand, Observable, scan, throwError } from 'rxjs';
import {
  Album,
  AlbumsPagedResponse,
  SharedAlbumsPagedResponse,
} from './Albums';

/**
 * Responsible for making requests to Google Photos that is albums related.
 */
@Injectable()
export class AlbumsRequestService {
  private hehe = new Set<string>();
  private haha = new Set<string>();

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  /**
   * Fetches all shared albums.
   *
   * @returns an observable of a list of shared albums.
   */
  fetchSharedAlbums(): Observable<Album[]> {
    return this.fetchSharedAlbumsPage().pipe(
      expand((response: SharedAlbumsPagedResponse) => {
        if (!response.sharedAlbums || !response.nextPageToken) {
          return EMPTY;
        }

        return this.fetchSharedAlbumsPage(response.nextPageToken);
      }),
      scan((acc: Album[], current) => acc.concat(current.sharedAlbums!), [])
    );
  }

  private fetchSharedAlbumsPage(
    pageToken: string | undefined = undefined
  ): Observable<SharedAlbumsPagedResponse> {
    const url = 'https://photoslibrary.googleapis.com/v1/sharedAlbums';
    const headers = {
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    };

    if (this.hehe.has(pageToken ?? '')) {
      return throwError(() => new Error('Token hehe already found'));
    }
    this.hehe.add(pageToken ?? '');

    const baseParams = { excludeNonAppCreatedData: 'false' };
    const params = pageToken ? { ...baseParams, pageToken } : baseParams;

    return this.httpClient.get<SharedAlbumsPagedResponse>(url, {
      headers,
      params,
    });
  }

  /**
   * Fetches all albums owned by the user.
   *
   * @returns an observable of a list of albums.
   */
  fetchAlbums(): Observable<Album[]> {
    return this.fetchAlbumsPage().pipe(
      expand((response: AlbumsPagedResponse) => {
        if (!response.albums || !response.nextPageToken) {
          return EMPTY;
        }

        return this.fetchAlbumsPage(response.nextPageToken);
      }),
      scan((acc: Album[], current) => acc.concat(current.albums!), [])
    );
  }

  private fetchAlbumsPage(
    pageToken: string | undefined = undefined
  ): Observable<AlbumsPagedResponse> {
    const url = 'https://photoslibrary.googleapis.com/v1/albums';
    const headers = {
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    };

    if (this.haha.has(pageToken ?? '')) {
      return throwError(() => new Error('Token haha already found'));
    }
    this.haha.add(pageToken ?? '');

    const baseParams = { excludeNonAppCreatedData: 'false' };
    const params = pageToken ? { ...baseParams, pageToken } : baseParams;

    return this.httpClient.get<AlbumsPagedResponse>(url, { headers, params });
  }
}
