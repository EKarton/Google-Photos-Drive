import { Injectable } from '@angular/core';
import { from, mergeMap, Observable } from 'rxjs';
import { MediaItem } from './MediaItems';
import { MediaItemsRequestService } from './MediaItemsRequest.service';

/**
 * Responsible for fetching and storing a list of media items.
 */
@Injectable()
export class MediaItemsRepositoryService {
  constructor(private mediaItemsRequestService: MediaItemsRequestService) {}

  /**
   * Returns a list of media items.
   * If the {@code albumId} is specified, it will only return the media items under that album.
   *
   * @param albumId the album id, if it exists.
   * @returns a list of media items, as an observable.
   */
  getMediaItems(
    albumId: string | undefined = undefined
  ): Observable<MediaItem[]> {
    return this.mediaItemsRequestService.fetchMediaItems(albumId);
  }

  /**
   * Returns a list of media items as a stream.
   * If the {@code albumId} is specified, it will only return the media items under that album.
   *
   * @param albumId the album id, if it exists.
   * @returns a stream of media items, as an observable.
   */
  getMediaItemsStream(
    albumId: string | undefined = undefined
  ): Observable<MediaItem> {
    return this.mediaItemsRequestService
      .fetchMediaItems(albumId)
      .pipe(mergeMap((mediaItems) => from(mediaItems)));
  }
}
