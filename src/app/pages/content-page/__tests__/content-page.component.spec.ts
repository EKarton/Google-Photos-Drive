import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NbThemeModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { provideLocationMocks } from '@angular/common/testing';
import { Component, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Base64 } from 'js-base64';
import { Album } from '../../../core/albums/Albums';
import { AlbumsRepositoryService } from '../../../core/albums/AlbumsRepository.service';
import { MediaItem } from '../../../core/media-items/MediaItems';
import { MediaItemsRepositoryService } from '../../../core/media-items/MediaItemsRepository.service';
import { AuthService } from '../../../core/auth/Auth.service';
import { ContentPageComponent } from '../content-page.component';

@Component({
  selector: 'app-test-empty-component',
  standalone: true,
})
class TestEmptyComponent {}

describe('ContentPageComponent', () => {
  let mockAlbumsRepositoryService: jasmine.SpyObj<AlbumsRepositoryService>;
  let mockMediaItemsRepositoryService: jasmine.SpyObj<MediaItemsRepositoryService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAlbumsRepositoryService = jasmine.createSpyObj(
      'AlbumsRepositoryService',
      ['getAllAlbumsStream']
    );
    mockAlbumsRepositoryService.getAllAlbumsStream.and.returnValue(
      of(...mockAlbums)
    );
    mockMediaItemsRepositoryService = jasmine.createSpyObj(
      'MediaItemsRepositoryService',
      ['getMediaItemsStream']
    );
    mockMediaItemsRepositoryService.getMediaItemsStream.and.returnValue(
      of(...mockMediaItems)
    );
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout']);
    mockAuthService.logout.and.returnValue(of(Object));

    TestBed.configureTestingModule({
      imports: [ContentPageComponent],
      providers: [
        { provide: 'Window', useValue: window },
        provideRouter([
          {
            path: 'content/:pathId',
            component: ContentPageComponent,
          },
          {
            path: 'auth/login',
            component: TestEmptyComponent,
          },
          {
            path: '404',
            component: TestEmptyComponent,
          },
        ]),
        provideLocationMocks(),
        importProvidersFrom(NbThemeModule.forRoot({ name: 'default' })),
        importProvidersFrom(NbEvaIconsModule),
      ],
    });

    TestBed.overrideProvider(AlbumsRepositoryService, {
      useValue: mockAlbumsRepositoryService,
    });
    TestBed.overrideProvider(MediaItemsRepositoryService, {
      useValue: mockMediaItemsRepositoryService,
    });
    TestBed.overrideProvider(AuthService, { useValue: mockAuthService });
  });

  it('should render albums and photos', async () => {
    await TestBed.compileComponents();
    const harness = await RouterTestingHarness.create();
    const fixture = harness.fixture;
    await harness.navigateByUrl(
      `/content/${encodeURIComponent(Base64.encode('Home'))}`,
      ContentPageComponent
    );
    harness.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();

    // Assert that the albums exist
    const albumElements = fixture.nativeElement.querySelectorAll(
      '.album-card__details'
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const archivesAlbumElement = Array.from(albumElements).filter((e: any) =>
      e.textContent.includes('Archives')
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unlabeledAlbumElement = Array.from(albumElements).filter((e: any) =>
      e.textContent.includes('Unlabeled Photos')
    );
    expect(archivesAlbumElement).not.toBeNull();
    expect(unlabeledAlbumElement).not.toBeNull();

    // Assert that the photos do exist
    const photoElements =
      fixture.nativeElement.querySelectorAll('.photo-card > img');
    const photoNames = mockMediaItems.map((m) => m.filename!);
    for (const photoName of photoNames) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const foundElement = Array.from(photoElements).filter((e: any) =>
        e.getAttribute('alt').includes(photoName)
      );
      expect(foundElement).not.toBeNull();
    }
  });

  it('should only render photos in the current album', async () => {
    await TestBed.compileComponents();
    const harness = await RouterTestingHarness.create();
    const fixture = harness.fixture;
    await harness.navigateByUrl(
      `/content/${encodeURIComponent(Base64.encode('Home/Archives'))}`,
      ContentPageComponent
    );
    harness.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();

    // Assert that the next album exist
    const albumElements = fixture.nativeElement.querySelectorAll(
      '.album-card__details'
    );
    expect(albumElements.length).toEqual(1);
    expect(albumElements[0].textContent.includes('Photos'));

    // Assert that no photos exist
    const photoElements =
      fixture.nativeElement.querySelectorAll('.photo-card > img');
    expect(photoElements.length).toEqual(0);
  });
});

const mockAlbums: Album[] = [
  {
    id: 'album1',
    title: 'Archives/Photos/2009/Dogs',
    productUrl: 'https://photos.google.com/albums/album1',
    coverPhotoBaseUrl: 'https://photos.google.com/albums/album1/cover',
    mediaItemsCount: 1,
  },
  {
    id: 'album2',
    title: 'Archives/Photos/2009/Cats',
    productUrl: 'https://photos.google.com/albums/album2',
    coverPhotoBaseUrl: 'https://photos.google.com/albums/album2/cover',
    mediaItemsCount: 2,
  },
  {
    id: 'album3',
    title: 'Archives/Photos/2010/Houses',
    productUrl: 'https://photos.google.com/albums/album3',
    coverPhotoBaseUrl: 'https://photos.google.com/albums/album3/cover',
    mediaItemsCount: 3,
  },
  {
    id: 'album4',
    title: 'Archives/Photos/2010/Cars',
    productUrl: 'https://photos.google.com/albums/album4',
    coverPhotoBaseUrl: 'https://photos.google.com/albums/album4/cover',
    mediaItemsCount: 4,
  },
  {
    id: 'album5',
    title: 'Unlabeled Photos',
    productUrl: 'https://photos.google.com/albums/album5',
    coverPhotoBaseUrl: 'https://photos.google.com/albums/album5/cover',
    mediaItemsCount: 4,
  },
];

const mockMediaItems: MediaItem[] = [
  {
    id: 'photos1',
    productUrl: 'https://photos.google.com/photos/photos1',
    baseUrl: 'https://photos.google.com/thumbnails/photos1',
    filename: 'Photo 1',
  },
  {
    id: 'photos2',
    productUrl: 'https://photos.google.com/photos/photos2',
    baseUrl: 'https://photos.google.com/thumbnails/photos2',
    filename: 'Photo 2',
  },
  {
    id: 'photos3',
    productUrl: 'https://photos.google.com/photos/photos3',
    baseUrl: 'https://photos.google.com/thumbnails/photos3',
    filename: 'Photo 3',
  },
  {
    id: 'photos4',
    productUrl: 'https://photos.google.com/photos/photos4',
    baseUrl: 'https://photos.google.com/thumbnails/photos4',
    filename: 'Photo 4',
  },
];
