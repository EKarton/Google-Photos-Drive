import { Injectable } from '@angular/core';
import {
  combineLatest,
  distinct,
  from,
  map,
  mergeMap,
  Observable,
  shareReplay,
} from 'rxjs';
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

  getAllAlbumsStream(): Observable<Album> {
    const flow1 = this.getAlbums();
    const flow2 = this.getSharedAlbums();

    return combineLatest([flow1, flow2]).pipe(
      map(([array1, array2]) => [...array1, ...array2]),
      mergeMap((albums) => from(albums)),
      distinct((album) => album.id)
    );
  }

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
