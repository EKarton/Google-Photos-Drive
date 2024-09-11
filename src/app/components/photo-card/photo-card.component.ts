import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-photo-card',
  standalone: true,
  imports: [],
  templateUrl: './photo-card.component.html',
  styleUrl: './photo-card.component.scss',
})
export class PhotoCardComponent {
  @Input() imgSrc!: string;
  @Input() imgName!: string;
}
