import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatIconModule } from '@angular/material/icon';
import { CnFilterChipsComponent } from './filter-chips.component';

@NgModule({
  imports: [CommonModule, MatChipsModule, MatIconModule, MatButtonModule],
  declarations: [CnFilterChipsComponent],
  exports: [CnFilterChipsComponent]
})
export class CnFilterChipsModule {}
