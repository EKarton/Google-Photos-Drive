import { TestBed } from '@angular/core/testing';
import { TreeNode } from '../TreeNode';
import { TreeRepositoryService } from '../TreeRepository.service';
import { lastValueFrom, of } from 'rxjs';
import { verifyTree } from './VerifyTree';
import { Album } from '../../albums/Albums';
import { expectedTree } from './StreamedAlbumsToTreeBuilderTestCase1';
import { AlbumsRepositoryService } from '../../albums/AlbumsRepository.service';

describe('TreeRepositoryService', () => {
  const albums: Album[] = [
    {
      id: 'album1',
      title: 'Archives/Photos/2010/Dogs',
      productUrl: 'www.google.com/album/1',
      coverPhotoBaseUrl: 'www.google.com/album/1/cover',
      mediaItemsCount: 10,
    },
    {
      id: 'album2',
      title: 'Archives/Photos/2010/Cats',
      productUrl: 'www.google.com/album/2',
      coverPhotoBaseUrl: 'www.google.com/album/2/cover',
      mediaItemsCount: 20,
    },
    {
      id: 'album3',
      title: 'Archives/Photos/2009/Cars',
      productUrl: 'www.google.com/album/3',
      coverPhotoBaseUrl: 'www.google.com/album/3/cover',
      mediaItemsCount: 2,
    },
    {
      id: 'album4',
      title: 'Archives/Photos/2009/Houses',
      productUrl: 'www.google.com/album/4',
      coverPhotoBaseUrl: 'www.google.com/album/4/cover',
      mediaItemsCount: 1,
    },
    {
      id: 'album5',
      title: 'Unsorted Photos',
      productUrl: 'www.google.com/album/5',
      coverPhotoBaseUrl: 'www.google.com/album/5/cover',
      mediaItemsCount: 150,
    },
    {
      id: 'album6',
      productUrl: 'www.google.com/album/6',
      coverPhotoBaseUrl: 'www.google.com/album/6/cover',
      mediaItemsCount: 5,
    },
  ];

  let service: TreeRepositoryService;

  beforeEach(() => {
    const albumRepositoryServiceMock = jasmine.createSpyObj(
      'AlbumsRepositoryService',
      ['getAllAlbumsStream']
    );
    albumRepositoryServiceMock.getAllAlbumsStream.and.returnValue(
      of(...albums)
    );

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        {
          provide: AlbumsRepositoryService,
          useValue: albumRepositoryServiceMock,
        },
        TreeRepositoryService,
      ],
    });

    service = TestBed.inject(TreeRepositoryService);
  });

  describe('getTreeNodeFromTitlePrefix()', () => {
    it('should return the correct tree node, given a title prefix in the tree', async () => {
      const flow = service.getTreeNodeFromTitlePrefix(
        'Home/Archives/Photos/2009'
      );
      const tree = await lastValueFrom(flow);

      const expectedTree: TreeNode = {
        id: 'mocked-uuid-value',
        title: '2009',
        coverPhotoBaseUrls: [
          'www.google.com/album/3/cover',
          'www.google.com/album/4/cover',
        ],
        totalMediaItemsCount: 3,
        totalAlbumsCount: 2,
        numPhotos: 0,
        isAlbum: false,
        childNodes: [
          {
            id: 'mocked-uuid-value',
            title: 'Cars',
            coverPhotoBaseUrls: ['www.google.com/album/3/cover'],
            totalMediaItemsCount: 2,
            totalAlbumsCount: 1,
            childNodes: [],
            numPhotos: 2,
            isAlbum: true,
            albumId: 'album3',
          },
          {
            id: 'mocked-uuid-value',
            title: 'Houses',
            coverPhotoBaseUrls: ['www.google.com/album/4/cover'],
            totalMediaItemsCount: 1,
            totalAlbumsCount: 1,
            childNodes: [],
            numPhotos: 1,
            isAlbum: true,
            albumId: 'album4',
          },
        ],
      };
      expect(tree).not.toBeNull();
      verifyTree(tree!, expectedTree);
    });

    it('should return null, given a title prefix not in the tree', async () => {
      const flow = service.getTreeNodeFromTitlePrefix('Random album');
      const tree = await lastValueFrom(flow);

      expect(tree).toBeNull();
    });

    it('should return null, given a title prefix matches but not in the tree', async () => {
      const flow = service.getTreeNodeFromTitlePrefix('Archives/Random album');
      const tree = await lastValueFrom(flow);

      expect(tree).toBeNull();
    });

    it('should return the entire tree, given no prefix', async () => {
      const flow = service.getTreeNodeFromTitlePrefix();
      const tree = await lastValueFrom(flow);

      expect(tree).not.toBeNull();
      verifyTree(tree!, expectedTree);
    });
  });
});
