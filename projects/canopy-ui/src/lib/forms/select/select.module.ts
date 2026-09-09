import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { CnSelectComponent } from './select.component';

@NgModule({
  imports: [CommonModule, MatFormFieldModule, MatSelectModule],
  declarations: [CnSelectComponent],
  exports: [CnSelectComponent]
})
export class CnSelectModule {}
