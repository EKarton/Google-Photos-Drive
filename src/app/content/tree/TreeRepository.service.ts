import { Injectable } from '@angular/core';
import {
  combineLatest,
  distinct,
  EMPTY,
  expand,
  firstValueFrom,
  from,
  map,
  mergeMap,
  Observable,
  of,
  reduce,
  shareReplay,
  zip,
} from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { TreeNode } from './TreeNode';
import { AlbumsRepositoryService } from '../albums/AlbumsRepository.service';
import { Album } from '../albums/Albums';

@Injectable()
export class TreeRepositoryService {
  private rootNode: Observable<TreeNode> | undefined;

  constructor(private albumsRepositoryService: AlbumsRepositoryService) {}

  getTreeNodeFromTitlePrefix(
    titlePrefix: string = ''
  ): Observable<TreeNode | null> {
    if (!this.rootNode) {
      this.rootNode = this.createTree().pipe(shareReplay(1));
    }

    return this.rootNode.pipe(
      map((node) => {
        if (!titlePrefix) {
          return node;
        }

        const titlesToSearchFor = titlePrefix.split('/');
        let curNode = node;
        for (const title of titlesToSearchFor) {
          const foundChildNode = curNode.childNodes.find(
            (node) => node.title === title
          );

          if (!foundChildNode) {
            return null;
          }

          curNode = foundChildNode;
        }

        return curNode;
      })
    );
  }

  private createTree(): Observable<TreeNode> {
    const flow1 = this.albumsRepositoryService.getAlbums();
    const flow2 = this.albumsRepositoryService.getSharedAlbums();

    const mergedAlbums = combineLatest([flow1, flow2]).pipe(
      map(([array1, array2]) => [...array1, ...array2]),
      mergeMap((albums) => from(albums)),
      distinct((album) => album.id)
    );

    const rootTreeNode = {
      id: uuidv4(),
      title: '',
      coverPhotoBaseUrl: [],
      totalMediaItemsCount: 0,
      childNodes: [],
      numPhotos: 0,
      getPhotos: () => EMPTY,
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
              getPhotos: () => EMPTY,
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
