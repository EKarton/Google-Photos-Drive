import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlbumCardComponent } from './album-card/album-card.component';

@NgModule({
  imports: [CommonModule, AlbumCardComponent],
  exports: [AlbumCardComponent],
})
export class AlbumsModule {}
