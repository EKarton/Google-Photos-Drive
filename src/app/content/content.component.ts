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
import { combineLatest, Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AlbumsRepositoryService } from './albums/AlbumsRepository.service';
import { Album } from './albums/Albums';
import { HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthRequestIntercepter } from '../auth/AuthRequestIntercepter';
import { AlbumsRequestService } from './albums/AlbumsRequest.service';
import { TreeRepositoryService } from './tree/TreeRepository.service';
import { TreeNode } from './tree/TreeNode';
import { AlbumsModule } from './albums/albums.module';

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
    AlbumsModule,
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
    TreeRepositoryService,
  ],
})
export class ContentComponent implements OnInit {
  options: string[] = ['Option 1', 'Option 2', 'Option 3'];
  filteredOptions$: Observable<string[]> = of(this.options);
  inputFormControl: FormControl = new FormControl();

  treeNode: TreeNode | null = null;
  path!: string;

  constructor(
    private treeRepositoryService: TreeRepositoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.treeNode = null;

      const pathParam = params.get('pathId')!;
      this.path = pathParam === 'root' ? '' : Base64.decode(pathParam);

      this.treeRepositoryService
        .getTreeNodeFromTitlePrefix(this.path)
        .subscribe({
          next: (treeNode) => {
            this.treeNode = treeNode;
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 401 || err.status === 400) {
              this.router.navigateByUrl('/auth/login');
            }
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

  albumClick(treeNode: TreeNode) {
    const newPath = this.path
      ? `${this.path}/${treeNode.title}`
      : treeNode.title;

    this.router
      .navigate(['/content', Base64.encode(newPath)])
      .then(() => console.log(`Navigated to ${newPath}`))
      .catch((err) =>
        console.error(`Failed to navigate to ${newPath}: ${err}`)
      );
  }
}
