import { AlbumsPagedResponse } from '../Albums';

export const albumsPage1: AlbumsPagedResponse = {
  albums: [
    {
      id: 'album1',
      productUrl: 'https://photos.google.com/albums/album1',
      coverPhotoBaseUrl: 'https://photos.google.com/albums/album1/cover',
      mediaItemsCount: 1,
    },
    {
      id: 'album2',
      productUrl: 'https://photos.google.com/albums/album2',
      coverPhotoBaseUrl: 'https://photos.google.com/albums/album2/cover',
      mediaItemsCount: 2,
    },
    {
      id: 'album3',
      productUrl: 'https://photos.google.com/albums/album3',
      coverPhotoBaseUrl: 'https://photos.google.com/albums/album3/cover',
      mediaItemsCount: 3,
    },
  ],
  nextPageToken: 'albumsPage2Token',
};

export const albumsPage2: AlbumsPagedResponse = {
  albums: [
    {
      id: 'album4',
      productUrl: 'https://photos.google.com/albums/album4',
      coverPhotoBaseUrl: 'https://photos.google.com/albums/album4/cover',
      mediaItemsCount: 4,
    },
    {
      id: 'album5',
      productUrl: 'https://photos.google.com/albums/album5',
      coverPhotoBaseUrl: 'https://photos.google.com/albums/album5/cover',
      mediaItemsCount: 5,
    },
    {
      id: 'album6',
      productUrl: 'https://photos.google.com/albums/album6',
      coverPhotoBaseUrl: 'https://photos.google.com/albums/album6/cover',
      mediaItemsCount: 6,
    },
  ],
  nextPageToken: '',
};
