import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAutocompleteModule,
  NbCardModule,
  NbInputModule,
  NbLayoutModule,
  NbSearchModule,
} from '@nebular/theme';
import { Base64 } from 'js-base64';
import { EMPTY, Observable, of } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';
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

@Component({
  selector: 'app-albums',
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
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
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
export class ContentComponent implements OnInit {
  options: string[] = ['Option 1', 'Option 2', 'Option 3'];
  filteredOptions$: Observable<string[]> = of(this.options);
  inputFormControl: FormControl = new FormControl();

  treeNode: TreeNode | null = null;
  photos: MediaItem[] | null = null;
  path!: string;
  pathBreadcrumbs!: Breadcrumb[];

  constructor(
    private treeRepositoryService: TreeRepositoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.treeNode = null;
      this.photos = null;
      this.path = Base64.decode(params.get('pathId')!);
      this.pathBreadcrumbs = this.getBreadcrumbs(this.path);

      this.treeRepositoryService
        .getTreeNodeFromTitlePrefix(this.path)
        .pipe(
          mergeMap((treeNode) => {
            if (!treeNode) {
              return EMPTY;
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
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 401 || err.status === 400) {
              this.router.navigateByUrl('/auth/login');
            }

            console.error('ERROR' + err);
          },
        });
    });

    this.filteredOptions$ = this.inputFormControl.valueChanges.pipe(
      startWith(''),
      map((filterString) => this.filter(filterString))
    );
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((optionValue) =>
      optionValue.toLowerCase().includes(filterValue)
    );
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
