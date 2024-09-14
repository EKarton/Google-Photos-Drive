import { from, lastValueFrom, Subject } from 'rxjs';
import StreamedAlbumsToTreeBuilder from '../StreamedAlbumsToTreeBuilder';
import * as TestCase1 from './StreamedAlbumsToTreeBuilderTestCase1';
import * as TestCase2 from './StreamedAlbumsToTreeBuilderTestCase2';
import { Album } from '../../albums/Albums';
import { verifyTree } from './VerifyTree';

describe('StreamedAlbumsToTreeBuilder', () => {
  describe('buildTree()', () => {
    it('should build a tree correctly, given a list of albums', async () => {
      const streamOfAlbums = from(TestCase1.albums);
      const treeFlow = StreamedAlbumsToTreeBuilder.buildTree(streamOfAlbums);
      const tree = await lastValueFrom(treeFlow);

      verifyTree(tree, TestCase1.expectedTree);
    });

    it('should build many trees correctly, given a list of albums emitted', (done) => {
      const streamOfAlbums = new Subject<Album>();
      const treeFlow = StreamedAlbumsToTreeBuilder.buildTree(streamOfAlbums);

      let treeIdx = 0;
      treeFlow.subscribe({
        next: (tree) => {
          const expectedTree = TestCase2.expectedTrees[treeIdx];

          try {
            verifyTree(tree, expectedTree);
          } catch (err) {
            throw new Error(`Failed on index ${treeIdx}\n` + err);
          }
          treeIdx += 1;

          if (treeIdx >= TestCase2.albumsToAddInStreams.length) {
            done();
          } else {
            streamOfAlbums.next(TestCase2.albumsToAddInStreams[treeIdx]);
          }
        },
        error: done.fail,
      });

      streamOfAlbums.next(TestCase2.albumsToAddInStreams[0]);
    });
  });
});
