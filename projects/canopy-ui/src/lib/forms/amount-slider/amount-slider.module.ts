import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { CnAmountSliderComponent } from './amount-slider.component';

@NgModule({
  imports: [CommonModule, MatSliderModule],
  declarations: [CnAmountSliderComponent],
  exports: [CnAmountSliderComponent]
})
export class CnAmountSliderModule {}
