/**
 * Represents a tree node in a tree
 */
export interface TreeNode {
  id: string;
  title: string;
  coverPhotoBaseUrls: string[];
  totalMediaItemsCount: number;
  totalAlbumsCount: number;
  childNodes: TreeNode[];
  numPhotos: number;
  isAlbum: boolean;
  albumId?: string;
  albumGooglePhotosLink?: string;
}
