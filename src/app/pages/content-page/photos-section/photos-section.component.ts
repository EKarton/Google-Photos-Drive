import { Component, Inject, Input } from '@angular/core';
import { MediaItem } from '../../../core/media-items/MediaItems';
import { PhotoCardComponent } from '../../../components/photo-card/photo-card.component';
import { ComponentsModule } from '../../../components/components.module';
import { NbButtonModule, NbLayoutModule } from '@nebular/theme';

@Component({
  selector: 'app-photos-section',
  standalone: true,
  imports: [
    ComponentsModule,
    PhotoCardComponent,
    NbLayoutModule,
    NbButtonModule,
  ],
  templateUrl: './photos-section.component.html',
  styleUrl: './photos-section.component.scss',
})
export class PhotosSectionComponent {
  @Input() photos!: MediaItem[];
  @Input() numPhotosLeft!: number | null;
  @Input() photosAlbumUrl!: string;

  constructor(@Inject('Window') private window: Window) {}

  handlePhotoClick(photo: MediaItem) {
    this.window.open(photo.productUrl, '_blank', 'noopener,noreferrer');
  }

  handleMorePhotosClick() {
    this.window.open(this.photosAlbumUrl, '_blank', 'noopener,noreferrer');
  }
}
