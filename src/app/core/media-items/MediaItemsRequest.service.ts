import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/Auth.service';
import { Injectable } from '@angular/core';
import { EMPTY, expand, Observable, scan } from 'rxjs';
import { MediaItem, MediaItemsPagedResponse } from './MediaItems';

/**
 * Responsible for making requests to Google Photos that is media-item related.
 */
@Injectable()
export class MediaItemsRequestService {
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  /**
   * Returns all media items under a particular album.
   * If no albumId is set, it returns all media items under that user.
   *
   * @param albumId the album ID, or undefined
   * @returns a list of media items, in an observable
   */
  fetchMediaItems(
    albumId: string | undefined = undefined
  ): Observable<MediaItem[]> {
    return this.fetchMediaItemsPage(albumId).pipe(
      expand((response: MediaItemsPagedResponse) => {
        if (!response.mediaItems || !response.nextPageToken) {
          return EMPTY;
        }

        return this.fetchMediaItemsPage(albumId, response.nextPageToken);
      }),
      scan((acc: MediaItem[], current) => acc.concat(current.mediaItems!), [])
    );
  }

  private fetchMediaItemsPage(
    albumId: string | undefined = undefined,
    pageToken: string | undefined = undefined
  ): Observable<MediaItemsPagedResponse> {
    const url = 'https://photoslibrary.googleapis.com/v1/mediaItems:search';
    const headers = {
      Authorization: `Bearer ${this.authService.getAccessToken()}`,
    };
    const body = {
      albumId: albumId,
      pageToken: pageToken,
    };
    const options = { headers };

    return this.httpClient.post<MediaItemsPagedResponse>(url, body, options);
  }
}
