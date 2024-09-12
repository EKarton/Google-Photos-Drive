import { Injectable } from '@angular/core';
import { defer, map, Observable, of, reduce, shareReplay } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { TreeNode } from './TreeNode';
import { AlbumsRepositoryService } from '../albums/AlbumsRepository.service';
import { Album } from '../albums/Albums';
import { MediaItemsRequestService } from '../media-items/MediaItemsRequest.service';

@Injectable()
export class TreeRepositoryService {
  private rootNode: Observable<TreeNode> | undefined;

  constructor(
    private albumsRepositoryService: AlbumsRepositoryService,
    private mediaItemsRequestService: MediaItemsRequestService
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

          console.log(curTitleIdx, titlesToSearchFor.length, firstTitle);

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

    const rootTreeNode = {
      id: uuidv4(),
      title: 'Home',
      coverPhotoBaseUrl: [],
      totalMediaItemsCount: 0,
      childNodes: [],
      numPhotos: 0,
      photos: defer(() => this.mediaItemsRequestService.fetchMediaItems()),
    };

    return mergedAlbums.pipe(
      reduce((rootNode: TreeNode, album: Album) => {
        const titles = album.title.split('/');

        let curNode = rootNode;
        for (const title of titles) {
          const foundChildNode = curNode.childNodes.find(
            (node) => node.title === title
          );

          if (!foundChildNode) {
            const newNode = {
              id: uuidv4(),
              title: title,
              coverPhotoBaseUrl: [album.coverPhotoBaseUrl],
              totalMediaItemsCount: album.mediaItemsCount,
              childNodes: [],
              numPhotos: 0,
              photos: of([]),
            };
            curNode.childNodes.push(newNode);
            curNode = newNode;
          } else {
            foundChildNode.totalMediaItemsCount += album.mediaItemsCount;
            foundChildNode.coverPhotoBaseUrl.push(album.coverPhotoBaseUrl);
            foundChildNode.coverPhotoBaseUrl = this.shuffleArray(
              foundChildNode.coverPhotoBaseUrl
            );

            if (foundChildNode.coverPhotoBaseUrl.length > 4) {
              foundChildNode.coverPhotoBaseUrl =
                foundChildNode.coverPhotoBaseUrl.slice(0, 4);
            }

            curNode = foundChildNode;
          }
        }

        curNode.numPhotos = album.mediaItemsCount;
        curNode.coverPhotoBaseUrl = [album.coverPhotoBaseUrl];
        curNode.photos = defer(() =>
          this.mediaItemsRequestService.fetchMediaItems(album.id)
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
