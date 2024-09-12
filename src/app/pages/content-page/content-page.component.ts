import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbSearchModule,
} from '@nebular/theme';
import { Base64 } from 'js-base64';
import { combineLatest, EMPTY, from, Observable, of, throwError } from 'rxjs';
import { distinct, map, mergeMap, startWith, take } from 'rxjs/operators';
import { AlbumsRepositoryService } from '../../core/albums/AlbumsRepository.service';
import { HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthRequestIntercepter } from '../../core/auth/AuthRequestIntercepter';
import { AlbumsRequestService } from '../../core/albums/AlbumsRequest.service';
import { TreeRepositoryService } from '../../core/tree/TreeRepository.service';
import { TreeNode } from '../../core/tree/TreeNode';
import { ComponentsModule } from '../../components/components.module';
import { Breadcrumb } from '../../components/breadcrumbs/breadcrumb';
import { MediaItemsRequestService } from '../../core/media-items/MediaItemsRequest.service';
import { MediaItem } from '../../core/media-items/MediaItems';
import { Album, isAlbum } from '../../core/albums/Albums';
import { DarkModeButtonComponent } from './dark-mode-button/dark-mode-button.component';

class SearchItem {
  constructor(public album: Album) {}

  toString(): string {
    return this.album.title;
  }
}

@Component({
  selector: 'app-content-page',
  standalone: true,
  imports: [
    NbLayoutModule,
    NbSearchModule,
    NbAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    AsyncPipe,
    NbCardModule,
    ComponentsModule,
    NbIconModule,
    NbButtonModule,
    DarkModeButtonComponent,
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
    TreeRepositoryService,
  ],
})
export class ContentPageComponent implements OnInit {
  options: SearchItem[] = [];
  filteredOptions$: Observable<SearchItem[]> = of(this.options);
  inputFormControl: FormControl = new FormControl();

  treeNode: TreeNode | null = null;
  photos: MediaItem[] | null = null;
  path!: string;
  pathBreadcrumbs!: Breadcrumb[];

  constructor(
    private treeRepositoryService: TreeRepositoryService,
    private albumsRepositoryService: AlbumsRepositoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.albumsRepositoryService.getAllAlbumsStream().subscribe({
      next: (album) => {
        this.options = [...this.options, new SearchItem(album)];
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401 || err.status === 400) {
          this.router.navigateByUrl('/auth/login');
        } else {
          this.router.navigateByUrl('/400');
        }
      },
    });

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

      this.treeRepositoryService
        .getTreeNodeFromTitlePrefix(this.path)
        .pipe(
          mergeMap((treeNode) => {
            if (!treeNode) {
              return throwError(() => new Error('No tree node found'));
            }

            return treeNode.photos.pipe(
              map((photos) => {
                return { treeNode, photos };
              })
            );
          })
        )
        .subscribe({
          next: ({ treeNode, photos }) => {
            this.treeNode = treeNode;
            this.photos = photos;
            this.pathBreadcrumbs = this.getBreadcrumbs(this.path);
          },
          error: (err: HttpErrorResponse) => {
            console.error('ERROR' + err);

            if (err.status === 401 || err.status === 400) {
              this.router.navigateByUrl('/auth/login');
            } else {
              this.router.navigateByUrl('/400');
            }
          },
        });
    });

    this.filteredOptions$ = this.inputFormControl.valueChanges.pipe(
      startWith(''),
      map((value?: SearchItem | string) => {
        console.log('I am here: ' + value);
        console.log(this.options);
        const filterString =
          value instanceof SearchItem ? value.album.title : value;
        const filter = this.filter(filterString);
        console.log('Options: ');
        console.log(filter);
        return filter;
      })
    );
  }

  private filter(value?: string): SearchItem[] {
    if (!value) {
      return this.options;
    }

    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.album.title.toLowerCase().includes(filterValue)
    );
  }

  onSelectionChange(selectedOption?: SearchItem) {
    if (selectedOption) {
      const path = `Home/${selectedOption.album.title}`;
      this.router.navigate(['/content', Base64.encode(path)]);
      this.inputFormControl.setValue('', { emitEvent: false });
    }
  }

  getBreadcrumbs(path: string): Breadcrumb[] {
    const pathParts = path.split('/');
    const breadcrumbs: Breadcrumb[] = [];

    let prevPath = '';
    for (let i = 0; i < pathParts.length; i++) {
      const pathPart = pathParts[i];
      const redirectPath = prevPath ? `${prevPath}/${pathPart}` : pathPart;

      const onClick = () => {
        this.router
          .navigate(['/content', Base64.encode(redirectPath)])
          .then(() =>
            console.log(`Navigated to ${redirectPath} from breadcrumb`)
          )
          .catch((err) =>
            console.error(
              `Failed to navigate to ${redirectPath} from breadcrumb: ${err}`
            )
          );
      };

      prevPath = redirectPath;
      const breadcrumb = {
        label: pathPart,
        onClick,
        isDisabled: i === pathParts.length - 1,
      };
      breadcrumbs.push(breadcrumb);
    }

    return breadcrumbs;
  }

  albumClick(treeNode: TreeNode) {
    const newPath = `${this.path}/${treeNode.title}`;
    this.router
      .navigate(['/content', Base64.encode(newPath)])
      .then(() => console.log(`Navigated to ${newPath}`))
      .catch((err) =>
        console.error(`Failed to navigate to ${newPath}: ${err}`)
      );
  }

  handlePhotoClick(photo: MediaItem) {
    window.open(photo.productUrl, '_blank', 'noopener,noreferrer');
  }
}
