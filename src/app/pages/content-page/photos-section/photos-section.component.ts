import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MediaItem } from '../../../core/media-items/MediaItems';
import { PhotoCardComponent } from '../../../components/photo-card/photo-card.component';
import { ComponentsModule } from '../../../components/components.module';
import { NbButtonModule, NbLayoutModule } from '@nebular/theme';
import { BehaviorSubject, Subscription, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
  NgxMasonryComponent,
  NgxMasonryModule,
  NgxMasonryOptions,
} from 'ngx-masonry';
import { MediaItemsRequestService } from '../../../core/media-items/MediaItemsRequest.service';

@Component({
  selector: 'app-photos-section',
  standalone: true,
  imports: [
    CommonModule,
    ComponentsModule,
    PhotoCardComponent,
    NbLayoutModule,
    NbButtonModule,
    NgxMasonryModule,
  ],
  templateUrl: './photos-section.component.html',
  styleUrl: './photos-section.component.scss',
})
export class PhotosSectionComponent implements OnInit, OnChanges, OnDestroy {
  @Input({ required: true }) gAlbumId?: string;
  @ViewChild(NgxMasonryComponent) masonry?: NgxMasonryComponent;

  photos: ImageCardItem[] = [];
  readonly masonryOptions: NgxMasonryOptions = {
    gutter: 40,
    fitWidth: true,
    columnWidth: 200,
  };

  private lastPageToken = '';
  private hasPhotosToFetch = true;
  private fetchMediaItemsPageRequests$ = new BehaviorSubject<string>('');
  private subscription?: Subscription;

  constructor(
    @Inject('Window') private window: Window,
    private router: Router,
    private mediaItemsRequestService: MediaItemsRequestService
  ) {}

  ngOnInit() {
    this.lastPageToken = '';
    this.photos = [];

    this.subscription = this.fetchMediaItemsPageRequests$
      .pipe(
        switchMap((pageToken: string) => {
          return this.mediaItemsRequestService.fetchMediaItemsPage(
            this.gAlbumId,
            pageToken
          );
        })
      )
      .subscribe({
        next: (data) => {
          if (!data.nextPageToken) {
            this.hasPhotosToFetch = false;
          } else {
            this.lastPageToken = data.nextPageToken;
          }

          const newImageCardItems: ImageCardItem[] = data.mediaItems.map(
            (item) => {
              const imageWidth = Number(item.mediaMetadata?.width ?? 200);
              const imageHeight = Number(item.mediaMetadata?.height ?? 200);
              const isLandscape = imageWidth > imageHeight;
              const width = isLandscape ? 440 : 200;
              const height = (imageHeight / imageWidth) * width;

              return {
                width: `${width}px`,
                height: `${height}px`,
                mediaItem: item,
              };
            }
          );
          this.photos = [...this.photos, ...newImageCardItems];

          this.masonry?.reloadItems();
          this.masonry?.layout();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401 || err.status === 400) {
            this.router.navigateByUrl('/auth/login');
          } else {
            this.router.navigateByUrl('/404');
          }
        },
      });
  }

  ngOnChanges() {
    this.lastPageToken = '';
    this.photos = [];
    this.fetchMediaItemsPageRequests$.next(this.lastPageToken);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  handlePhotoClick(photo: ImageCardItem) {
    this.window.open(
      photo.mediaItem.productUrl,
      '_blank',
      'noopener,noreferrer'
    );
  }

  handleMorePhotosClick() {
    if (this.hasPhotosToFetch) {
      this.fetchMediaItemsPageRequests$.next(this.lastPageToken);
    }
  }
}

export interface ImageCardItem {
  width: string;
  height: string;
  mediaItem: MediaItem;
}
