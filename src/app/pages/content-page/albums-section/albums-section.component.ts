import { Component, Input } from '@angular/core';
import { TreeNode } from '../../../core/tree/TreeNode';
import { Base64 } from 'js-base64';
import { Router } from '@angular/router';
import { ComponentsModule } from '../../../components/components.module';

@Component({
  selector: 'app-albums-section',
  standalone: true,
  imports: [ComponentsModule],
  templateUrl: './albums-section.component.html',
  styleUrl: './albums-section.component.scss',
})
export class AlbumsSectionComponent {
  @Input() albums!: TreeNode[];
  @Input() path!: string;

  constructor(private router: Router) {}

  albumClick(treeNode: TreeNode) {
    const newPath = `${this.path}/${treeNode.title}`;
    this.router.navigate(['/content', Base64.encode(newPath)]);
  }
}
