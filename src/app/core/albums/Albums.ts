export interface AlbumsPagedResponse {
  albums: Album[] | undefined;
  nextPageToken: string | undefined;
}

export interface SharedAlbumsPagedResponse {
  sharedAlbums: Album[] | undefined;
  nextPageToken: string | undefined;
}

export interface Album {
  id: string;
  title?: string;
  productUrl: string;
  coverPhotoBaseUrl: string;
  coverPhotoMediaItemId: string;
  isWriteable: string;
  mediaItemsCount: number;
}
