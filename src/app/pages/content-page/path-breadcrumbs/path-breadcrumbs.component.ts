import { Component, Input } from '@angular/core';
import { Base64 } from 'js-base64';
import { Router } from '@angular/router';
import { Breadcrumb } from '../../../components/breadcrumbs/breadcrumb';
import { BreadcrumbsComponent } from '../../../components/breadcrumbs/breadcrumbs.component';
import { ComponentsModule } from '../../../components/components.module';

@Component({
  selector: 'app-path-breadcrumbs',
  standalone: true,
  imports: [BreadcrumbsComponent, ComponentsModule],
  templateUrl: './path-breadcrumbs.component.html',
  styleUrl: './path-breadcrumbs.component.scss',
})
export class PathBreadcrumbsComponent {
  pathBreadcrumbs!: Breadcrumb[];

  @Input()
  set path(value: string) {
    this.pathBreadcrumbs = this.getBreadcrumbs(value);
  }

  constructor(private router: Router) {}

  getBreadcrumbs(path: string): Breadcrumb[] {
    const pathParts = path.split('/');
    const breadcrumbs: Breadcrumb[] = [];

    let prevPath = '';
    for (let i = 0; i < pathParts.length; i++) {
      const pathPart = pathParts[i];
      const redirectPath = prevPath ? `${prevPath}/${pathPart}` : pathPart;
      const breadcrumb = {
        label: pathPart,
        onClick: () => {
          this.router.navigate(['/content', Base64.encode(redirectPath)]);
        },
        isDisabled: i === pathParts.length - 1,
      };

      prevPath = redirectPath;
      breadcrumbs.push(breadcrumb);
    }

    return breadcrumbs;
  }
}
