import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Album } from './Albums';
import { AlbumsRequestService } from './AlbumsRequest.service';

@Injectable()
export class AlbumsRepositoryService {
  private sharedAlbumsCache: Observable<Album[]> | undefined;
  private albumsCache: Observable<Album[]> | undefined;

  constructor(private albumsRequestService: AlbumsRequestService) {}

  /** Returns all shared albums */
  getSharedAlbums(): Observable<Album[]> {
    if (!this.sharedAlbumsCache) {
      this.sharedAlbumsCache = this.albumsRequestService.fetchSharedAlbums();
    }

    return this.sharedAlbumsCache;
  }

  /** Returns all albums */
  getAlbums(): Observable<Album[]> {
    if (!this.albumsCache) {
      this.albumsCache = this.albumsRequestService.fetchAlbums();
    }

    return this.albumsCache;
  }
}
