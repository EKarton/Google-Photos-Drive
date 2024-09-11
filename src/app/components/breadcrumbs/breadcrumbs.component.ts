import { Component, Input } from '@angular/core';
import { Breadcrumb } from './breadcrumb';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent {
  @Input() items!: Breadcrumb[];
}
