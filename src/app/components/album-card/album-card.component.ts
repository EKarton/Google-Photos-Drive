import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-album-card',
  standalone: true,
  imports: [],
  templateUrl: './album-card.component.html',
  styleUrl: './album-card.component.scss',
})
export class AlbumCardComponent {
  @Input() albumTitle!: string;
  @Input() numPhotos!: number;
  @Input() numSubAlbums!: number;
  @Input() coverPhotoBaseUrls!: string[];
}
