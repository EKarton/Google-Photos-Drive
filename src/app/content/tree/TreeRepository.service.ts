import { Injectable } from '@angular/core';
import {
  combineLatest,
  EMPTY,
  expand,
  firstValueFrom,
  from,
  map,
  mergeMap,
  Observable,
  of,
  reduce,
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
      this.rootNode = this.createTree();
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
      mergeMap((albums) => from(albums))
    );

    const rootTreeNode = {
      id: uuidv4(),
      title: '',
      coverPhotoBaseUrl: [],
      totalMediaItemsCount: 0,
      childNodes: [],
      getPhotos: () => EMPTY,
    };

    return mergedAlbums.pipe(
      reduce((rootNode: TreeNode, album: Album) => {
        const titles = album.title.split('/');
        console.log(titles);

        let curNode = rootNode;
        for (const title of titles) {
          console.log('Processing ' + title);
          const foundChildNode = curNode.childNodes.find(
            (node) => node.title === title
          );

          console.log('foundChildNode: ' + foundChildNode);

          if (!foundChildNode) {
            const newNode = {
              id: uuidv4(),
              title: title,
              coverPhotoBaseUrl: [],
              totalMediaItemsCount: 0,
              childNodes: [],
              getPhotos: () => EMPTY,
            };
            curNode.childNodes.push(newNode);
            curNode = newNode;
          } else {
            curNode = foundChildNode;
          }
        }

        return rootNode;
      }, rootTreeNode)
    );
  }
}
