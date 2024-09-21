import { Component, OnInit } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NbLayoutModule } from '@nebular/theme';
import { Base64 } from 'js-base64';
import { AlbumsRepositoryService } from '../../core/albums/AlbumsRepository.service';
import { AuthRequestIntercepter } from '../../core/auth/AuthRequestIntercepter';
import { AlbumsRequestService } from '../../core/albums/AlbumsRequest.service';
import { TreeRepositoryService } from '../../core/tree/TreeRepository.service';
import { MediaItemsRepositoryService } from '../../core/media-items/MediaItemsRepository.service';
import { TreeNode } from '../../core/tree/TreeNode';
import { MediaItemsRequestService } from '../../core/media-items/MediaItemsRequest.service';
import { HeaderComponent } from './header/header.component';
import { PathBreadcrumbsComponent } from './path-breadcrumbs/path-breadcrumbs.component';
import { PhotosSectionComponent } from './photos-section/photos-section.component';
import { AlbumsSectionComponent } from './albums-section/albums-section.component';

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
  path = '';

  constructor(
    private treeRepositoryService: TreeRepositoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const parsedPath = Base64.decode(params.get('pathId')!);

      if (!parsedPath) {
        console.error('Invalid path', this.path);
        this.router.navigate(['/404']);
        return;
      }

      this.treeNode = null;
      this.path = parsedPath;

      this.treeRepositoryService
        .getTreeNodeFromTitlePrefix(this.path)
        .subscribe({
          next: (treeNode) => {
            this.treeNode = treeNode;
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 401 || err.status === 400) {
              this.router.navigate(['/auth/login']);
            } else {
              this.router.navigate(['/404']);
            }
          },
        });
    });
  }
}
