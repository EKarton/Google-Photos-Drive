import { Component, OnInit } from '@angular/core';
import { NbLayoutModule } from '@nebular/theme';
import { Base64 } from 'js-base64';
import { filter, first, switchMap, take, toArray } from 'rxjs/operators';
import { AlbumsRepositoryService } from '../../core/albums/AlbumsRepository.service';
import { HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthRequestIntercepter } from '../../core/auth/AuthRequestIntercepter';
import { AlbumsRequestService } from '../../core/albums/AlbumsRequest.service';
import { TreeRepositoryService } from '../../core/tree/TreeRepository.service';
import { TreeNode } from '../../core/tree/TreeNode';
import { MediaItemsRequestService } from '../../core/media-items/MediaItemsRequest.service';
import { MediaItem } from '../../core/media-items/MediaItems';
import { HeaderComponent } from './header/header.component';
import { PathBreadcrumbsComponent } from './path-breadcrumbs/path-breadcrumbs.component';
import { PhotosSectionComponent } from './photos-section/photos-section.component';
import { AlbumsSectionComponent } from './albums-section/albums-section.component';
import { MediaItemsRepositoryService } from '../../core/media-items/MediaItemsRepository.service';

@Component({
  selector: 'app-content-page',
  standalone: true,
  imports: [
    NbLayoutModule,
    HeaderComponent,
    PathBreadcrumbsComponent,
    PhotosSectionComponent,
    AlbumsSectionComponent,
  ],
  templateUrl: './content-page.component.html',
  styleUrl: './content-page.component.scss',
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthRequestIntercepter,
      multi: true,
    },
    AlbumsRequestService,
    AlbumsRepositoryService,
    MediaItemsRequestService,
    MediaItemsRepositoryService,
    TreeRepositoryService,
  ],
})
export class ContentPageComponent implements OnInit {
  treeNode: TreeNode | null = null;
  photos: MediaItem[] | null = null;
  path!: string;

  constructor(
    private treeRepositoryService: TreeRepositoryService,
    private mediaItemsRepositoryService: MediaItemsRepositoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.treeNode = null;
      this.photos = null;

      try {
        this.path = Base64.decode(params.get('pathId')!);
      } catch (err) {
        console.error('Error while parsing path from url', err);
        this.router.navigateByUrl('/500');
        return;
      }

      const treeNodePipe =
        this.treeRepositoryService.getTreeNodeFromTitlePrefix(this.path);
      const photosPipe = treeNodePipe.pipe(
        filter((treeNode) => treeNode !== null),
        first(),
        switchMap((treeNode) => {
          return this.mediaItemsRepositoryService
            .getMediaItemsStream(treeNode.albumId)
            .pipe(take(35), toArray());
        })
      );

      treeNodePipe.subscribe({
        next: (treeNode) => {
          this.treeNode = treeNode;
        },
        error: this.handleObservableError,
      });

      photosPipe.subscribe({
        next: (photos) => {
          this.photos = photos;
        },
        error: this.handleObservableError,
      });
    });
  }

  private handleObservableError(err: HttpErrorResponse) {
    console.error('ERROR' + err);

    if (err.status === 401 || err.status === 400) {
      this.router.navigateByUrl('/auth/login');
    } else {
      this.router.navigateByUrl('/400');
    }
  }
}
