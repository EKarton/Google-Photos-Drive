import { Component, Inject, Input } from '@angular/core';
import { MediaItem } from '../../../core/media-items/MediaItems';
import { PhotoCardComponent } from '../../../components/photo-card/photo-card.component';
import { ComponentsModule } from '../../../components/components.module';

@Component({
  selector: 'app-photos-section',
  standalone: true,
  imports: [ComponentsModule, PhotoCardComponent],
  templateUrl: './photos-section.component.html',
  styleUrl: './photos-section.component.scss',
})
export class PhotosSectionComponent {
  @Input() photos!: MediaItem[];

  constructor(@Inject('Window') private window: Window) {}

  handlePhotoClick(photo: MediaItem) {
    this.window.open(photo.productUrl, '_blank', 'noopener,noreferrer');
  }
}
