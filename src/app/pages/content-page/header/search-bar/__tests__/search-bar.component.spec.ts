import { Component, importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from '../search-bar.component';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { NbLayoutModule, NbThemeModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AlbumsRepositoryService } from '../../../../../core/albums/AlbumsRepository.service';
import { Album } from '../../../../../core/albums/Albums';
import { firstValueFrom, of } from 'rxjs';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-test-empty-component',
  standalone: true,
})
class TestEmptyComponent {}

@Component({
  selector: 'app-test-search-bar-component-host',
  standalone: true,
  imports: [NbLayoutModule, SearchBarComponent],
  template: `
    <nb-layout>
      <nb-layout-header>
        <app-search-bar />
      </nb-layout-header>
    </nb-layout>
  `,
})
class TestSearchBarComponent {}

describe('SearchBarComponent', () => {
  let mockAlbumsRepositoryService: jasmine.SpyObj<AlbumsRepositoryService>;
  let router: Router;
  let fixture: ComponentFixture<TestSearchBarComponent>;
  let component: TestSearchBarComponent;

  beforeEach(async () => {
    mockAlbumsRepositoryService = jasmine.createSpyObj(
      'AlbumsRepositoryService',
      ['getAllAlbumsStream']
    );
    mockAlbumsRepositoryService.getAllAlbumsStream.and.returnValue(
      of(...mockAlbums)
    );

    await TestBed.configureTestingModule({
      imports: [TestSearchBarComponent],
      providers: [
        {
          provide: AlbumsRepositoryService,
          useValue: mockAlbumsRepositoryService,
        },
        provideRouter([
          {
            path: 'content/:pathId',
            component: TestEmptyComponent,
          },
        ]),
        provideLocationMocks(),
        importProvidersFrom(NbThemeModule.forRoot({ name: 'default' })),
        importProvidersFrom(NbEvaIconsModule),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(TestSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render the component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter on the list of albums when the user types in the search box', () => {
    // Type in the search query '2009'
    const searchElement = fixture.nativeElement.querySelector('input');
    searchElement.click();
    searchElement.value = '2009';
    searchElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Check that only 'Archives/Photos/2009/Dogs' and 'Archives/Photos/2009/Cats' are shown
    const elements = fixture.nativeElement.querySelectorAll('nb-option');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const texts = Array.from(elements).map((e: any) =>
      e.getAttribute('ng-reflect-value')
    );
    const expectedResults = new Set([
      'Archives/Photos/2009/Dogs',
      'Archives/Photos/2009/Cats',
    ]);
    expect(new Set(texts)).toEqual(expectedResults);
  });

  it('should navigate to the correct album when the user clicks on a search result', async () => {
    // Type in the search query 'Cats'
    const searchElement = fixture.nativeElement.querySelector('input');
    searchElement.click();
    searchElement.value = 'Cats';
    searchElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Click on the first search result
    fixture.nativeElement.querySelector('nb-option').click();
    fixture.detectChanges();

    // Expect the router to change
    const lastRouterEvent = await firstValueFrom(router.events);
    const expectedUrl = `/content/${encodeURIComponent(
      Base64.encode('Home/Archives/Photos/2009/Cats')
    )}`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((lastRouterEvent as any).url).toEqual(expectedUrl);
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
];
