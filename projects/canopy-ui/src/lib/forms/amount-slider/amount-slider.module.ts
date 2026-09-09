import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacySliderModule as MatSliderModule } from '@angular/material/legacy-slider';
import { CnAmountSliderComponent } from './amount-slider.component';

/**
 * @deprecated Imports `MatLegacySliderModule`, removed in Material 16. See `CnAmountSliderComponent`
 * and KAN-27.
 */
@NgModule({
  imports: [CommonModule, MatSliderModule],
  declarations: [CnAmountSliderComponent],
  exports: [CnAmountSliderComponent]
})
export class CnAmountSliderModule {}
