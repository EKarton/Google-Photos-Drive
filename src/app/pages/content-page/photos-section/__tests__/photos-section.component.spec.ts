import { TestBed } from '@angular/core/testing';
import { MediaItemsPagedResponse } from '../../../../core/media-items/MediaItems';
import { PhotosSectionComponent } from '../photos-section.component';
import { Component, importProvidersFrom } from '@angular/core';
import { NbThemeModule } from '@nebular/theme';
import { provideRouter, Router } from '@angular/router';
import { MediaItemsRequestService } from '../../../../core/media-items/MediaItemsRequest.service';
import { firstValueFrom, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-test-empty-component',
  standalone: true,
})
class TestEmptyComponent {}

describe('PhotosSectionComponent', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockWindow: jasmine.SpyObj<any>;
  let mockMediaItemsRequestService: jasmine.SpyObj<MediaItemsRequestService>;
  let router: Router;

  beforeEach(async () => {
    mockWindow = jasmine.createSpyObj({
      open: jasmine.createSpy(),
    });
    mockMediaItemsRequestService = jasmine.createSpyObj(
      'MediaItemsRequestService',
      ['fetchMediaItemsPage']
    );
    mockMediaItemsRequestService.fetchMediaItemsPage.and.callFake(
      (albumId?: string, pageToken?: string) => {
        if (albumId !== 'albumId1') {
          return throwError(
            () =>
              new HttpErrorResponse({
                status: 400,
                statusText: 'Unknown album ID',
              })
          );
        }

        if (!pageToken) {
          return of(page1);
        } else if (pageToken === page1.nextPageToken) {
          return of(page2);
        } else {
          return throwError(
            () =>
              new HttpErrorResponse({
                status: 400,
                statusText: 'Unknown page token',
              })
          );
        }
      }
    );

    await TestBed.configureTestingModule({
      imports: [PhotosSectionComponent],
      providers: [
        { provide: 'Window', useValue: mockWindow },
        provideRouter([
          {
            path: 'auth/login',
            component: TestEmptyComponent,
          },
          {
            path: '404',
            component: TestEmptyComponent,
          },
        ]),
        importProvidersFrom(NbThemeModule.forRoot({ name: 'default' })),
        provideAnimations(),
      ],
    }).compileComponents();
    TestBed.overrideProvider(MediaItemsRequestService, {
      useValue: mockMediaItemsRequestService,
    });

    router = TestBed.inject(Router);
  });

  it('should render the first page of photos', async () => {
    const fixture = TestBed.createComponent(PhotosSectionComponent);
    const component = fixture.componentInstance;
    component.gAlbumId = 'albumId1';
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component).toBeTruthy();

    const elements = fixture.nativeElement.querySelectorAll('img');
    expect(elements.length).toEqual(3);
    expect(elements[0].src).toEqual(
      'https://photos.google.com/thumbnails/photo1'
    );
    expect(elements[1].src).toEqual(
      'https://photos.google.com/thumbnails/photo2'
    );
    expect(elements[2].src).toEqual(
      'https://photos.google.com/thumbnails/photo3'
    );
  });

  it('should render the first and second page of photos when user clicks on the "Show more photos" button', async () => {
    const fixture = TestBed.createComponent(PhotosSectionComponent);
    const component = fixture.componentInstance;
    component.gAlbumId = 'albumId1';
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    await fixture.whenStable();

    const elements = fixture.nativeElement.querySelectorAll('img');
    expect(elements.length).toEqual(6);
    expect(elements[0].src).toEqual(
      'https://photos.google.com/thumbnails/photo1'
    );
    expect(elements[1].src).toEqual(
      'https://photos.google.com/thumbnails/photo2'
    );
    expect(elements[2].src).toEqual(
      'https://photos.google.com/thumbnails/photo3'
    );
    expect(elements[3].src).toEqual(
      'https://photos.google.com/thumbnails/photo4'
    );
    expect(elements[4].src).toEqual(
      'https://photos.google.com/thumbnails/photo5'
    );
    expect(elements[5].src).toEqual(
      'https://photos.google.com/thumbnails/photo6'
    );
  });

  it('should navigate to url when user clicks on a photo', async () => {
    const fixture = TestBed.createComponent(PhotosSectionComponent);
    const component = fixture.componentInstance;
    component.gAlbumId = 'albumId1';
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.nativeElement.querySelector('img').click();

    expect(mockWindow.open).toHaveBeenCalledWith(
      'https://photos.google.com/photos/photo1',
      '_blank',
      'noopener,noreferrer'
    );
  });

  [
    { errorCode: 401, expectedRedirect: '/auth/login' },
    { errorCode: 400, expectedRedirect: '/auth/login' },
    { errorCode: 500, expectedRedirect: '/404' },
  ].forEach(({ errorCode, expectedRedirect }) => {
    it(`should take user to ${expectedRedirect} page if it encounters a ${errorCode} error`, async () => {
      mockMediaItemsRequestService.fetchMediaItemsPage.and.returnValue(
        throwError(
          () =>
            new HttpErrorResponse({ status: errorCode, statusText: 'Error' })
        )
      );
      const fixture = TestBed.createComponent(PhotosSectionComponent);
      const component = fixture.componentInstance;
      component.gAlbumId = 'albumId1';
      fixture.detectChanges();

      const lastRouterEvent = await firstValueFrom(router.events);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((lastRouterEvent as any).url).toEqual(expectedRedirect);
    });
  });
});

const page1: MediaItemsPagedResponse = {
  mediaItems: [
    {
      id: 'photo1',
      productUrl: 'https://photos.google.com/photos/photo1',
      baseUrl: 'https://photos.google.com/thumbnails/photo1',
    },
    {
      id: 'photo2',
      productUrl: 'https://photos.google.com/photos/photo2',
      baseUrl: 'https://photos.google.com/thumbnails/photo2',
    },
    {
      id: 'photo3',
      productUrl: 'https://photos.google.com/photos/photo3',
      baseUrl: 'https://photos.google.com/thumbnails/photo3',
    },
  ],
  nextPageToken: 'page2',
};

const page2: MediaItemsPagedResponse = {
  mediaItems: [
    {
      id: 'photo4',
      productUrl: 'https://photos.google.com/photos/photo4',
      baseUrl: 'https://photos.google.com/thumbnails/photo4',
    },
    {
      id: 'photo5',
      productUrl: 'https://photos.google.com/photos/photo5',
      baseUrl: 'https://photos.google.com/thumbnails/photo5',
    },
    {
      id: 'photo6',
      productUrl: 'https://photos.google.com/photos/photo6',
      baseUrl: 'https://photos.google.com/thumbnails/photo6',
    },
  ],
  nextPageToken: '',
};
