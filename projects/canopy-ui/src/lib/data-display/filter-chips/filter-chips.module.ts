import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CnFilterChipsComponent } from './filter-chips.component';

/**
 * @deprecated Imports `MatLegacyChipsModule`, removed in Material 16. See `CnFilterChipsComponent`
 * and KAN-28.
 */
@NgModule({
  imports: [CommonModule, MatChipsModule, MatIconModule, MatButtonModule],
  declarations: [CnFilterChipsComponent],
  exports: [CnFilterChipsComponent]
})
export class CnFilterChipsModule {}
