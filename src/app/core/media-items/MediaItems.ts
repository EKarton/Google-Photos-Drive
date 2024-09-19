export interface MediaItemsPagedResponse {
  mediaItems: MediaItem[];
  nextPageToken: string;
}

export interface MediaItem {
  id: string;
  description?: string;
  productUrl: string;
  baseUrl: string;
  mimeType?: string;
  mediaMetadata: {
    creationTime: string;
    width: string;
    height: string;
    photo: PhotoMediaItemMetadata | undefined;
    video: VideoMediaItemMetadata | undefined;
  };
  contributorInfo?: {
    profilePictureBaseUrl: string;
    displayName: string;
  };
  filename?: string;
}

export interface PhotoMediaItemMetadata {
  cameraMake: string;
  cameraModel: string;
  focalLength: number;
  apertureFNumber: number;
  isoEquivalent: number;
  exposureTime: string;
}

export interface VideoMediaItemMetadata {
  cameraMake: string;
  cameraModel: string;
  fps: number;
  status: string;
}
