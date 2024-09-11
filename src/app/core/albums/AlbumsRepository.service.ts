import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Album } from './Albums';
import { AlbumsRequestService } from './AlbumsRequest.service';

/**
 * Responsible for fetching and storing a list of albums.
 */
@Injectable()
export class AlbumsRepositoryService {
  private sharedAlbumsCache: Observable<Album[]> | undefined;
  private albumsCache: Observable<Album[]> | undefined;

  constructor(private albumsRequestService: AlbumsRequestService) {}

  /**
   * Returns all shared albums.
   *
   * @returns an observable of a list of albums.
   */
  getSharedAlbums(): Observable<Album[]> {
    if (!this.sharedAlbumsCache) {
      this.sharedAlbumsCache = this.albumsRequestService
        .fetchSharedAlbums()
        .pipe(shareReplay(1));
    }

    return this.sharedAlbumsCache;
  }

  /**
   * Returns all albums owned by the user.
   *
   * @returns an observable of a list of albums .
   */
  getAlbums(): Observable<Album[]> {
    if (!this.albumsCache) {
      this.albumsCache = this.albumsRequestService
        .fetchAlbums()
        .pipe(shareReplay(1));
    }

    return this.albumsCache;
  }
}
