import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { CnColumnDefDirective } from './column-def.directive';
import { CnDataTableComponent } from './data-table.component';

@NgModule({
  imports: [CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatCheckboxModule, MatProgressBarModule],
  declarations: [CnDataTableComponent, CnColumnDefDirective],
  exports: [CnDataTableComponent, CnColumnDefDirective]
})
export class CnDataTableModule {}
