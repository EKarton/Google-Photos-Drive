import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbAutocompleteModule,
  NbInputModule,
  NbLayoutModule,
  NbSearchModule,
} from '@nebular/theme';
import { map, Observable, of, startWith } from 'rxjs';
import { AlbumsRepositoryService } from '../../../../core/albums/AlbumsRepository.service';
import { Router } from '@angular/router';
import { Album } from '../../../../core/albums/Albums';
import { Base64 } from 'js-base64';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    NbLayoutModule,
    NbSearchModule,
    NbAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    AsyncPipe,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
  options: SearchItem[] = [];
  filteredOptions$: Observable<SearchItem[]> = of(this.options);
  inputFormControl: FormControl = new FormControl();

  constructor(
    private albumsRepositoryService: AlbumsRepositoryService,
    private router: Router
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

    this.filteredOptions$ = this.inputFormControl.valueChanges.pipe(
      startWith(''),
      map((value?: SearchItem | string) => {
        if (!value) {
          return this.options;
        }

        const filterString =
          value instanceof SearchItem ? value.album?.title || '' : value;

        const filterValue = filterString.toLowerCase();
        return this.options.filter((option) =>
          option.album.title?.toLowerCase().includes(filterValue)
        );
      })
    );
  }

  onSelectionChange(selectedOption?: SearchItem) {
    if (selectedOption) {
      const path = `Home/${selectedOption.album.title}`;
      this.router.navigate(['/content', Base64.encode(path)]);
    }
  }
}

class SearchItem {
  constructor(public album: Album) {}

  toString(): string {
    return this.album.title ?? 'Album with no title';
  }
}
