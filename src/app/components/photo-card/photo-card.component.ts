import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-photo-card',
  standalone: true,
  imports: [],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
})
export class PhotoCardComponent {
  @Input({ required: true }) imgSrc!: string;
  @Input({ required: true }) imgName!: string;
  @Input({ required: true }) width!: string;
  @Input({ required: true }) height!: string;
}
