import { Observable, scan } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { TreeNode } from './TreeNode';
import { Album } from '../albums/Albums';

/** A class responsible for building a tree from a stream of albums */
export default class StreamedAlbumsToTreeBuilder {
  /**
   * Returns a tree from a stream of albums, whose album titles are delimited with '/'.
   *
   * @param albumsStream a stream of albums
   * @returns a tree, as an observable
   */
  static buildTree(albumsStream: Observable<Album>): Observable<TreeNode> {
    const rootTreeNode: TreeNode = {
      id: uuidv4(),
      title: 'Home',
      coverPhotoBaseUrls: [],
      totalMediaItemsCount: 0,
      totalAlbumsCount: 0,
      childNodes: [],
      numPhotos: 0,
      isAlbum: true,
      albumId: undefined,
    };

    return albumsStream.pipe(
      scan((rootNode: TreeNode, album: Album) => {
        if (!album.title) {
          return rootNode;
        }

        const titles = album.title.split('/');

        let curNode = rootNode;
        for (const title of titles) {
          const foundChildNode = curNode.childNodes.find(
            (node) => node.title === title
          );

          if (!foundChildNode) {
            const newNode: TreeNode = {
              id: uuidv4(),
              title: title,
              coverPhotoBaseUrls: [album.coverPhotoBaseUrl],
              totalMediaItemsCount: album.mediaItemsCount,
              totalAlbumsCount: 1,
              childNodes: [],
              numPhotos: 0,
              isAlbum: false,
              albumId: undefined,
            };
            curNode.childNodes.push(newNode);
            curNode = newNode;
          } else {
            foundChildNode.totalAlbumsCount += 1;
            foundChildNode.totalMediaItemsCount += album.mediaItemsCount;
            foundChildNode.coverPhotoBaseUrls.push(album.coverPhotoBaseUrl);
            foundChildNode.coverPhotoBaseUrls = this.shuffleArray(
              foundChildNode.coverPhotoBaseUrls
            );

            if (foundChildNode.coverPhotoBaseUrls.length > 6) {
              foundChildNode.coverPhotoBaseUrls =
                foundChildNode.coverPhotoBaseUrls.slice(0, 6);
            }

            curNode = foundChildNode;
          }
        }

        curNode.numPhotos = album.mediaItemsCount;
        curNode.totalAlbumsCount = 1;
        curNode.coverPhotoBaseUrls = [album.coverPhotoBaseUrl];
        curNode.isAlbum = true;
        curNode.albumId = album.id;
        curNode.albumGooglePhotosLink = album.productUrl;

        return rootNode;
      }, rootTreeNode)
    );
  }

  /** Shuffles an array */
  private static shuffleArray<T>(array: T[]): T[] {
    const length = array.length;

    for (let i = length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  }
}
