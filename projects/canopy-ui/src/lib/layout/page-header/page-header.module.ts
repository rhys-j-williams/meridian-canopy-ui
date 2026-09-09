import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CnPageHeaderComponent } from './page-header.component';

@NgModule({
  imports: [CommonModule, RouterModule, MatIconModule],
  declarations: [CnPageHeaderComponent],
  exports: [CnPageHeaderComponent]
})
export class CnPageHeaderModule {}
