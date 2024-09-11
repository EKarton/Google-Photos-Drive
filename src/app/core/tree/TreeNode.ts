import { Observable } from 'rxjs';
import { MediaItem } from '../media-items/MediaItems';

export interface TreeNode {
  id: string;
  title: string;
  coverPhotoBaseUrl: string[];
  totalMediaItemsCount: number;
  childNodes: TreeNode[];
  numPhotos: number;
  photos: Observable<MediaItem[]>;
}
