import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { CnRadioGroupComponent } from './radio-group.component';

@NgModule({
  imports: [CommonModule, MatRadioModule],
  declarations: [CnRadioGroupComponent],
  exports: [CnRadioGroupComponent]
})
export class CnRadioGroupModule {}
