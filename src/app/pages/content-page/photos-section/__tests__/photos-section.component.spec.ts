import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaItemsPagedResponse } from '../../../../core/media-items/MediaItems';
import { PhotosSectionComponent } from '../photos-section.component';
import { Component, importProvidersFrom } from '@angular/core';
import { NbThemeModule } from '@nebular/theme';
import { provideRouter } from '@angular/router';
import { MediaItemsRequestService } from '../../../../core/media-items/MediaItemsRequest.service';
import { of, throwError } from 'rxjs';
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

  let component: PhotosSectionComponent;
  let fixture: ComponentFixture<PhotosSectionComponent>;

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

    fixture = TestBed.createComponent(PhotosSectionComponent);
    component = fixture.componentInstance;
    component.gAlbumId = 'albumId1';
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should render the first page of photos', () => {
    console.error(fixture.nativeElement);
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
    expect(component).toBeTruthy();

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    await fixture.whenStable();

    console.error(fixture.nativeElement);

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

  it('should navigate to url when user clicks on a photo', () => {
    fixture.nativeElement.querySelector('img').click();

    expect(mockWindow.open).toHaveBeenCalledWith(
      'https://photos.google.com/photos/photo1',
      '_blank',
      'noopener,noreferrer'
    );
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
