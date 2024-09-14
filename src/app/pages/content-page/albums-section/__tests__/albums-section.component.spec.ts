import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumsSectionComponent } from '../albums-section.component';
import { TreeNode } from '../../../../core/tree/TreeNode';
import { Router } from '@angular/router';
import { Base64 } from 'js-base64';

describe('AlbumsSectionComponent', () => {
  let routerSpy: jasmine.SpyObj<Router>;

  let component: AlbumsSectionComponent;
  let fixture: ComponentFixture<AlbumsSectionComponent>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.resolveTo(true);

    await TestBed.configureTestingModule({
      imports: [AlbumsSectionComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AlbumsSectionComponent);
    component = fixture.componentInstance;
    component.albums = albums;
    component.path = 'Archives/Photos/2010';
    fixture.detectChanges();
  });

  it('should render all albums', () => {
    expect(component).toBeTruthy();

    const elements = fixture.nativeElement.querySelectorAll(
      '.album-card__details'
    );
    expect(elements.length).toEqual(3);
    expect(elements[0].textContent).toContain('Cars');
    expect(elements[1].textContent).toContain('Houses');
    expect(elements[2].textContent).toContain('Trucks');
  });

  it('should navigate to the correct path when user clicks on an album', () => {
    const elements = fixture.nativeElement.querySelectorAll(
      '.album-card__details'
    );
    elements[0].click();

    expect(component).toBeTruthy();
    expect(routerSpy.navigate).toHaveBeenCalledWith([
      '/content',
      Base64.encode('Archives/Photos/2010/Cars'),
    ]);
  });
});

const albums: TreeNode[] = [
  {
    id: 'mocked-uuid-value',
    title: 'Cars',
    coverPhotoBaseUrls: ['www.google.com/album/3/cover'],
    totalMediaItemsCount: 2,
    totalAlbumsCount: 1,
    childNodes: [],
    numPhotos: 2,
    isAlbum: true,
    albumId: 'album3',
  },
  {
    id: 'mocked-uuid-value',
    title: 'Houses',
    coverPhotoBaseUrls: ['www.google.com/album/4/cover'],
    totalMediaItemsCount: 1,
    totalAlbumsCount: 1,
    childNodes: [],
    numPhotos: 1,
    isAlbum: true,
    albumId: 'album4',
  },
  {
    id: 'mocked-uuid-value',
    title: 'Trucks',
    coverPhotoBaseUrls: ['www.google.com/album/5/cover'],
    totalMediaItemsCount: 1,
    totalAlbumsCount: 1,
    childNodes: [],
    numPhotos: 2,
    isAlbum: true,
    albumId: 'album5',
  },
];
