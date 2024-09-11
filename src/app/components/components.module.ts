import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { AlbumCardComponent } from './album-card/album-card.component';
import { PhotoCardComponent } from './photo-card/photo-card.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BreadcrumbsComponent,
    AlbumCardComponent,
    PhotoCardComponent,
  ],
  exports: [BreadcrumbsComponent, AlbumCardComponent, PhotoCardComponent],
})
export class ComponentsModule {}
