import { SharedAlbumsPagedResponse } from '../Albums';

export const sharedAlbumsPage1: SharedAlbumsPagedResponse = {
  sharedAlbums: [
    {
      id: 'sharedAlbum1',
      productUrl: 'https://photos.google.com/albums/sharedAlbum1',
      coverPhotoBaseUrl: 'https://photos.google.com/albums/sharedAlbum1/cover',
      mediaItemsCount: 1,
    },
    {
      id: 'sharedAlbum2',
      productUrl: 'https://photos.google.com/albums/sharedAlbum2',
      coverPhotoBaseUrl: 'https://photos.google.com/albums/sharedAlbum2/cover',
      mediaItemsCount: 2,
    },
    {
      id: 'sharedAlbum3',
      productUrl: 'https://photos.google.com/albums/sharedAlbum3',
      coverPhotoBaseUrl: 'https://photos.google.com/albums/sharedAlbum3/cover',
      mediaItemsCount: 3,
    },
  ],
  nextPageToken: 'sharedAlbumsPage2Token',
};
export const sharedAlbumsPage2: SharedAlbumsPagedResponse = {
  sharedAlbums: [
    {
      id: 'sharedAlbum4',
      productUrl: 'https://photos.google.com/albums/sharedAlbum4',
      coverPhotoBaseUrl: 'https://photos.google.com/albums/sharedAlbum4/cover',
      mediaItemsCount: 4,
    },
    {
      id: 'sharedAlbum5',
      productUrl: 'https://photos.google.com/albums/sharedAlbum5',
      coverPhotoBaseUrl: 'https://photos.google.com/albums/sharedAlbum5/cover',
      mediaItemsCount: 5,
    },
    {
      id: 'sharedAlbum6',
      productUrl: 'https://photos.google.com/albums/sharedAlbum6',
      coverPhotoBaseUrl: 'https://photos.google.com/albums/sharedAlbum6/cover',
      mediaItemsCount: 6,
    },
  ],
  nextPageToken: '',
};
