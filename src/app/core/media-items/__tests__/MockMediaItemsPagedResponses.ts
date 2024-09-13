import { MediaItemsPagedResponse } from '../MediaItems';

export const page1: MediaItemsPagedResponse = {
  mediaItems: [
    {
      id: 'photo1',
      productUrl: 'https://photos.google.com/photos/photo1',
      baseUrl: 'https://photos.google.com/thumbnails/photo1',
    },
    {
      id: 'photo2',
      productUrl: 'https://photos.google.com/photos/photo2',
      baseUrl: 'https://photos.google.com/thumbnails/photo2',
    },
    {
      id: 'photo3',
      productUrl: 'https://photos.google.com/photos/photo3',
      baseUrl: 'https://photos.google.com/thumbnails/photo3',
    },
  ],
  nextPageToken: 'page2',
};

export const page2: MediaItemsPagedResponse = {
  mediaItems: [
    {
      id: 'photo4',
      productUrl: 'https://photos.google.com/photos/photo4',
      baseUrl: 'https://photos.google.com/thumbnails/photo4',
    },
    {
      id: 'photo5',
      productUrl: 'https://photos.google.com/photos/photo5',
      baseUrl: 'https://photos.google.com/thumbnails/photo5',
    },
    {
      id: 'photo6',
      productUrl: 'https://photos.google.com/photos/photo6',
      baseUrl: 'https://photos.google.com/thumbnails/photo6',
    },
  ],
  nextPageToken: '',
};
