import { Injectable } from '@angular/core';
import {
  defer,
  map,
  Observable,
  of,
  scan,
  shareReplay,
  take,
  toArray,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { TreeNode } from './TreeNode';
import { AlbumsRepositoryService } from '../albums/AlbumsRepository.service';
import { Album } from '../albums/Albums';
import { MediaItemsRepositoryService } from '../media-items/MediaItemsRepository.service';

@Injectable()
export class TreeRepositoryService {
  private rootNode: Observable<TreeNode> | undefined;

  constructor(
    private albumsRepositoryService: AlbumsRepositoryService,
    private mediaItemsRepositoryService: MediaItemsRepositoryService
  ) {}

  getTreeNodeFromTitlePrefix(titlePrefix = ''): Observable<TreeNode | null> {
    if (!this.rootNode) {
      this.rootNode = this.createTree().pipe(shareReplay(1));
    }

    const titlesToSearchFor = titlePrefix.split('/');

    return this.rootNode.pipe(
      map((node) => {
        function findNode(
          node: TreeNode,
          curTitleIdx: number
        ): TreeNode | null {
          if (curTitleIdx >= titlesToSearchFor.length) {
            return null;
          }

          const firstTitle = titlesToSearchFor[curTitleIdx];
          if (node.title !== firstTitle) {
            return null;
          }

          if (curTitleIdx === titlesToSearchFor.length - 1) {
            return node.title === firstTitle ? node : null;
          }

          for (const childNode of node.childNodes) {
            const foundNode = findNode(childNode, curTitleIdx + 1);
            if (foundNode) {
              return foundNode;
            }
          }

          return null;
        }

        return findNode(node, 0);
      })
    );
  }

  private createTree(): Observable<TreeNode> {
    const mergedAlbums = this.albumsRepositoryService.getAllAlbumsStream();

    const rootTreeNode: TreeNode = {
      id: uuidv4(),
      title: 'Home',
      coverPhotoBaseUrls: [],
      totalMediaItemsCount: 0,
      totalAlbumsCount: 0,
      childNodes: [],
      numPhotos: 0,
      photos: defer(() =>
        this.mediaItemsRepositoryService
          .getMediaItemsStream()
          .pipe(take(35), toArray())
      ),
    };

    return mergedAlbums.pipe(
      scan((rootNode: TreeNode, album: Album) => {
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
              photos: of([]),
            };
            curNode.childNodes.push(newNode);
            curNode = newNode;
          } else {
            foundChildNode.totalAlbumsCount += 1
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
        curNode.totalAlbumsCount = 0;
        curNode.coverPhotoBaseUrls = [album.coverPhotoBaseUrl];
        curNode.photos = defer(() =>
          this.mediaItemsRepositoryService
            .getMediaItemsStream(album.id)
            .pipe(take(35), toArray())
        );

        return rootNode;
      }, rootTreeNode)
    );
  }

  private shuffleArray<T>(array: T[]): T[] {
    const length = array.length;

    for (let i = length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }

    return array;
  }
}
