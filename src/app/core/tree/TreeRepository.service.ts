import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { TreeNode } from './TreeNode';
import { AlbumsRepositoryService } from '../albums/AlbumsRepository.service';
import StreamedAlbumsToTreeBuilder from './StreamedAlbumsToTreeBuilder';

@Injectable()
export class TreeRepositoryService {
  private rootNode: Observable<TreeNode> | undefined;

  constructor(private albumsRepositoryService: AlbumsRepositoryService) {}

  getTreeNodeFromTitlePrefix(
    titlePrefix?: string
  ): Observable<TreeNode | null> {
    if (!this.rootNode) {
      this.rootNode = this.createTree().pipe(shareReplay(1));
    }

    if (!titlePrefix) {
      return this.rootNode;
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
    return StreamedAlbumsToTreeBuilder.buildTree(
      this.albumsRepositoryService.getAllAlbumsStream()
    );
  }
}
