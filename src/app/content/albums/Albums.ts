export type AlbumsPagedResponse = {
  albums: Album[] | undefined;
  nextPageToken: string | undefined;
};

export type SharedAlbumsPagedResponse = {
  sharedAlbums: Album[] | undefined;
  nextPageToken: string | undefined;
};

export type Album = {
  id: string;
  title: string;
  productUrl: string;
  coverPhotoBaseUrl: string;
  coverPhotoMediaItemId: string;
  isWriteable: string;
  mediaItemsCount: number;
};
