import { TreeNode } from '../TreeNode';

export function verifyTree(actualTree: TreeNode, expectedTree: TreeNode) {
  if (actualTree.title !== expectedTree.title) {
    throwError(
      actualTree,
      expectedTree,
      `Titles do not match! ${actualTree.title} vs ${expectedTree.title}`
    );
  }
  if (actualTree.totalAlbumsCount !== expectedTree.totalAlbumsCount) {
    throwError(
      actualTree,
      expectedTree,
      `Total albums count do not match! ${actualTree.totalAlbumsCount} vs ${expectedTree.totalAlbumsCount}`
    );
  }
  if (actualTree.numPhotos !== expectedTree.numPhotos) {
    throwError(
      actualTree,
      expectedTree,
      `Num photos count do not match! ${actualTree.numPhotos} vs ${expectedTree.numPhotos}`
    );
  }
  if (actualTree.albumId !== expectedTree.albumId) {
    throwError(
      actualTree,
      expectedTree,
      `Album IDs do not match! ${actualTree.albumId} vs ${expectedTree.albumId}`
    );
  }
  if (actualTree.isAlbum !== expectedTree.isAlbum) {
    throwError(
      actualTree,
      expectedTree,
      `isAlbum property do not match! ${actualTree.isAlbum} vs ${expectedTree.isAlbum}`
    );
  }
  if (
    actualTree.coverPhotoBaseUrls.length !==
    expectedTree.coverPhotoBaseUrls.length
  ) {
    throwError(
      actualTree,
      expectedTree,
      `CoverPhotoBaseUrls set lengths do not match! ${actualTree.coverPhotoBaseUrls} vs ${expectedTree.coverPhotoBaseUrls}`
    );
  }
  if (actualTree.totalMediaItemsCount !== expectedTree.totalMediaItemsCount) {
    throwError(
      actualTree,
      expectedTree,
      `Total media items count do not match! ${actualTree.totalMediaItemsCount} vs ${expectedTree.totalMediaItemsCount}`
    );
  }
  if (actualTree.childNodes.length !== expectedTree.childNodes.length) {
    throwError(
      actualTree,
      expectedTree,
      `Num child nodes do not match! ${actualTree.childNodes.length} vs ${expectedTree.childNodes.length}`
    );
  }

  // Ordering doesnt matter in childNodes; hence we are exhausting it
  for (const actualChildNode of actualTree.childNodes) {
    for (const expectedChildNode of expectedTree.childNodes) {
      if (actualChildNode.title === expectedChildNode.title) {
        verifyTree(actualChildNode, expectedChildNode);
      }
    }
  }
}

function throwError(
  actualTree: TreeNode,
  expectedTree: TreeNode,
  description: string
) {
  throw new Error(
    `Assertion error: ${description} \n` +
      'Expected Tree: \n' +
      `${JSON.stringify(expectedTree, null, 2)} \n` +
      'Actual Tree: \n' +
      `${JSON.stringify(actualTree, null, 2)} \n`
  );
}
