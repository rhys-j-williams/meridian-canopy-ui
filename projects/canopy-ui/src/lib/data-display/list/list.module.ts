import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { CnListComponent } from './list.component';

@NgModule({
  imports: [CommonModule, MatListModule, MatIconModule, MatDividerModule],
  declarations: [CnListComponent],
  exports: [CnListComponent]
})
export class CnListModule {}
