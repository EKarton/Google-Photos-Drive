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
  title: string;
  productUrl: string;
  coverPhotoBaseUrl: string;
  coverPhotoMediaItemId: string;
  isWriteable: string;
  mediaItemsCount: number;
}

export function isAlbum(obj: any): obj is Album {
  return (
    'id' in obj &&
    'title' in obj &&
    'productUrl' in obj &&
    'coverPhotoBaseUrl' in obj &&
    'coverPhotoMediaItemId' in obj &&
    'isWriteable' in obj &&
    'mediaItemsCount' in obj
  );
}
