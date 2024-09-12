import { Component, Input } from '@angular/core';
import { MediaItem } from '../../../core/media-items/MediaItems';
import { ComponentsModule } from '../../../components/components.module';
import { PhotoCardComponent } from '../../../components/photo-card/photo-card.component';

@Component({
  selector: 'app-photos-section',
  standalone: true,
  imports: [ComponentsModule, PhotoCardComponent],
  templateUrl: './photos-section.component.html',
  styleUrl: './photos-section.component.scss',
})
export class PhotosSectionComponent {
  @Input() photos!: MediaItem[];

  handlePhotoClick(photo: MediaItem) {
    window.open(photo.productUrl, '_blank', 'noopener,noreferrer');
  }
}
