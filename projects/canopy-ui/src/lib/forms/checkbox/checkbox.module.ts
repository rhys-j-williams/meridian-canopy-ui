import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { CnCheckboxComponent } from './checkbox.component';

@NgModule({
  imports: [CommonModule, MatCheckboxModule],
  declarations: [CnCheckboxComponent],
  exports: [CnCheckboxComponent]
})
export class CnCheckboxModule {}
