import { Observable } from 'rxjs';
import { MediaItem } from '../media-items/MediaItems';

export interface TreeNode {
  id: string;
  title: string;
  coverPhotoBaseUrls: string[];
  totalMediaItemsCount: number;
  totalAlbumsCount: number;
  childNodes: TreeNode[];
  numPhotos: number;
  photos: Observable<MediaItem[]>;
}
