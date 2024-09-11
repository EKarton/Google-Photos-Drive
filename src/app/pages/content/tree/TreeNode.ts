import { Observable } from 'rxjs';

export type TreeNode = {
  id: string;
  title: string;
  coverPhotoBaseUrl: string[];
  totalMediaItemsCount: number;
  childNodes: TreeNode[];
  numPhotos: number;
  getPhotos: () => Observable<any>;
};
